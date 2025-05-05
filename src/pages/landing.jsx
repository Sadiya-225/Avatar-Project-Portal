import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-5 sm:gap-10 py-10 sm:py-20">
      <section className="text-center space-y-4 sm:space-y-6">
        <h1 className="flex flex-col items-center justify-center gradient-title animate-gradient font-bold text-5xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Dream Project
          <span className="flex items-center gap-2 sm:gap-6">
            only at Avatar
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-base sm:text-xl">
          Explore thousands of open source projects and find the perfect project
          for you!
        </p>
      </section>
      <div className="flex justify-center space-x-4">
        <Link to={"/jobs"}>
          <Button size="lg" className="px-8">
            Find Projects
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button size="lg" variant="outline" className="px-8">
            Post a Project
          </Button>
        </Link>
      </div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <img src="/banner.svg" className="w-1/2 h-auto mx-auto" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Contributers</CardTitle>
          </CardHeader>
          <CardContent>
            Discover beginner-friendly projects, connect with mentors, and build
            your portfolio through open-source contributions.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">For Project Creators</CardTitle>
          </CardHeader>
          <CardContent>
            Share your project ideas, find contributors, and build a community
            around your open-source project.
          </CardContent>
        </Card>
      </section>

      <Accordion type="multiple" className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
