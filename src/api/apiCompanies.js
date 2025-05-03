import supabaseClient, { supabaseUrl } from "@/utils/supabase";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  try {
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    console.log('Attempting to upload file:', {
      fileName,
      fileType: companyData.logo?.type,
      fileSize: companyData.logo?.size
    });

    const { error: storageError, data: uploadData } = await supabase.storage
      .from("company-logo")
      .upload(fileName, companyData.logo);

    if (storageError) {
      console.error('Storage upload error:', storageError);
      throw new Error(`Error uploading Company Logo: ${storageError.message}`);
    }

    console.log('File uploaded successfully:', uploadData);

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          name: companyData.name,
          logo_url: logo_url,
        },
      ])
      .select();

    if (error) {
      console.error('Database insert error:', error);
      throw new Error("Error submitting Company");
    }

    return data;
  } catch (error) {
    console.error('Company creation error:', error);
    throw error;
  }
}
