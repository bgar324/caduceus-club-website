import FeedbackBox from "./FeedbackBox";
import SessionHeader from "./SessionHeader";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <section className="relative min-h-[70vh] bg-[#733a84] flex items-cent</section>er justify-center">
        <div className="text-ce</div>nter px-4">
          <Image
            src="/static/15th-annual-hpc-graphic-crop-v1.png"
            alt="15th Annual Health Professions Conference Logo"
            width={600}
            height={600}
            loading="eager"
            className="mx-auto"
          />
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-white">
            15th Annual Health Professions Conference
          </h1>
          <p className="mt-2 text-white text-lg">
            We'd love to hear your thoughts — scroll down to find your session
            and send us your feedback.
          </p>
          <div className="mt-8 animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </div>
        </div>
      </section>

      <main className="relative z-20 bg-white rounded-t-xl -mt-6 h-auto px-2 md:px-128 py-8 w-full">
        <section id="conference-form" className="mb-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all mx-auto duration-300 hover:-translate-y-[.125rem]">
            <h3 className="font-semibold mb-3 text-gray-800 text-xl">
              Annual Health Professions Conference Survey
            </h3>
            <p className="text-gray-600 mb-5">
              Thank you for attending! Please fill out this quick survey so we
              may improve next year.
            </p>
            <a
              href="https://forms.gle/6kAsHAJNWZ6rGDqd9"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-[#733a84] text-white text-center rounded-lg font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Provide Feedback
            </a>
          </div>
        </section>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="w1">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Workshop 1 Sessions"
                headerTime="10:10 am - 11:05 am"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section id="Workshop 1 Sessions" className="bg-white py-4 px-2">
                <div className="flex flex-col gap-6 pt-2">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="Careers in Medicine"
                    description="Explore cutting-edge technologies transforming patient care and medical practice."
                    feedbackUrl="https://forms.gle/6HLVAN3H46QEnv5S9"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Careers in Nursing"
                    description="Learn about the diverse opportunities and challenges in the nursing profession."
                    feedbackUrl="https://forms.gle/nQcqLFmfNGa3rabs9"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="Careers in the Laboratory"
                    description="Discover the critical role of laboratory professionals in healthcare."
                    feedbackUrl="https://forms.gle/YDFPRjWigshu8uzD8"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="Careers in Veterinary Medicine"
                    description="Explore the rewarding field of veterinary medicine and animal care."
                    feedbackUrl="https://forms.gle/cKPU8e2ymZc7itTHA"
                  />
                  <FeedbackBox
                    sessionLetter="E:"
                    sessionTitle="Reducing Public Health Emergencies in Developing Nations"
                    description="Learn strategies to mitigate public health crises in underserved regions."
                    feedbackUrl="https://forms.gle/dBrFYnU5YYsRruABA"
                  />
                  <FeedbackBox
                    sessionLetter="F:"
                    sessionTitle="Women Physicians in Family Practice"
                    description="Celebrate the contributions of women physicians in family medicine."
                    feedbackUrl="https://forms.gle/DkKHKA8r3yRyzyN86"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="w2">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Workshop 2 Sessions"
                headerTime="11:10 am - 12:05 pm"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section id="Workshop 2 Sessions" className="bg-white py-4 px-2">
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="A Military Career in Dentistry"
                    description="Explore the unique opportunities and challenges of a military career in dentistry."
                    feedbackUrl="https://forms.gle/1AX1WQNfe78zUfm8A"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Neurosurgeon, Researcher, Mentor: Making a Difference"
                    description="Learn about the impactful career of a neurosurgeon who is also a researcher and mentor."
                    feedbackUrl="https://forms.gle/tAFfF1Pt5eT8pzVS7"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="One Health Model: Predicting and Preventing the Next Pandemic"
                    description="Discover how the One Health Model helps predict and prevent global pandemics."
                    feedbackUrl="https://forms.gle/GQxdfiSxFdpZuD7C7"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="Thriving in the Fast Lane: A Discussion of Career and Life Balance with Women in Emergency Medicine"
                    description="Join a discussion on balancing career and life as women in emergency medicine."
                    feedbackUrl="https://forms.gle/Em8zPWEDGokttgYp9"
                  />
                  <FeedbackBox
                    sessionLetter="E:"
                    sessionTitle="Making the Most of Your Global Health Experience"
                    description="Gain insights on maximizing the impact of your global health experiences."
                    feedbackUrl="https://forms.gle/FZqyvBoFQChPqaq37"
                  />
                  <FeedbackBox
                    sessionLetter="F:"
                    sessionTitle="Podiatrists Make a Big Difference in Patient’s Lives … Find Out How!"
                    description="Learn how podiatrists make a significant impact on patients' lives."
                    feedbackUrl="https://forms.gle/zGRySP3eL5r8fVcY7"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="w3">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Workshop 3 Sessions"
                headerTime="12:10 pm - 1:05 pm"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section id="Workshop 3 Sessions" className="bg-white py-4 px-2">
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="Medical School Admissions Panel"
                    description="Gain insights into the medical school admissions process from experts."
                    feedbackUrl="https://forms.gle/AooeL1KVa27oV1QZA"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Summer Internship Programs & Altamed Institute for Health Equity"
                    description="Learn about summer internships and health equity initiatives."
                    feedbackUrl="https://forms.gle/ue4LUcaRJQmZHEf66"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="How to Get a 99th Percentile MCAT Score"
                    description="Discover strategies to achieve a top score on the MCAT."
                    feedbackUrl="https://forms.gle/hzHSbesTEtvqCQzaA"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="Bone Marrow Transplants and Graft vs Host Disease"
                    description="Understand the complexities of bone marrow transplants and related conditions."
                    feedbackUrl="https://forms.gle/A3fe27MEP6RfF9vm9"
                  />
                  <FeedbackBox
                    sessionLetter="E:"
                    sessionTitle="Careers in Public Health"
                    description="Explore the diverse opportunities available in public health careers."
                    feedbackUrl="https://forms.gle/6GkChnoTjGjBobDCA"
                  />
                  <FeedbackBox
                    sessionLetter="F:"
                    sessionTitle="UCI School of Medicine Program in Medical Education for the Latino Community (PRIME-LC)"
                    description="Learn about PRIME-LC and its mission to serve the Latino community."
                    feedbackUrl="https://forms.gle/Ebxc8hqzz6nS5vxJ9"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-row mb-10 mx-6">
          <Separator className="bg-gray-300 mr-8" />
          {/* <span className="text-gray-800 text-sm font-medium truncate">
            Focus Groups
          </span>
          <Separator className="bg-gray-200 ml-8" /> */}
        </div>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="fg1">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Focus Group 1 Sessions"
                headerTime="3:00 pm - 3:45 pm"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section
                id="Focus Group 1 Sessions"
                className="bg-white py-4 px-2"
              >
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="Introduction to the Doula and Midwifery Professions"
                    description="Learn about the vital roles of doulas and midwives in maternal healthcare."
                    feedbackUrl="https://forms.gle/DbdnKAcF8fjoMysS7"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Caring for Patients with Gender Dysphoria: Perspectives of a Reconstructive Surgeon"
                    description="Understand the surgical aspects of gender-affirming care from a reconstructive surgeon."
                    feedbackUrl="https://forms.gle/BdpYYp1XbzmS7S1r5"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="Global Public Health: Seeking Solutions for Problems of Global Impact"
                    description="Explore approaches to addressing worldwide public health challenges."
                    feedbackUrl="https://forms.gle/7xrCUCbugXzWLPTJ7"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="Medical Student Panel"
                    description="Get firsthand insights from current medical students about their experiences."
                    feedbackUrl="https://forms.gle/pDjhy792Srg4E8rw6"
                  />
                  <FeedbackBox
                    sessionLetter="E:"
                    sessionTitle="Community College to PharmD"
                    description="Learn about the pathway from community college to becoming a Doctor of Pharmacy."
                    feedbackUrl="https://forms.gle/tpPSn8AiZs22XeS2A"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="fg2">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Focus Group 2 Sessions"
                headerTime="3:45 pm - 4:30 pm"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section
                id="Focus Group 2 Sessions"
                className="bg-white py-4 px-2"
              >
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="MCAT Strategies: Solving Problems with Swartwood"
                    description="Learn effective strategies for tackling MCAT problems."
                    feedbackUrl="https://forms.gle/E69K6bixikqH7yyH7"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Beyond the Basics: The Secret Journey of a Laboratory Sample"
                    description="Discover the intricate process of laboratory sample handling and analysis."
                    feedbackUrl="https://forms.gle/dwrBV4oBGi8WxzcYA"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="Native American Health Disparities: A Call to Action"
                    description="Explore health disparities affecting Native American communities and solutions."
                    feedbackUrl="https://forms.gle/YU9Uq9U6jtqy4kL89"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="WHAT … NO EGGS? The Story of HPAI (Highly Pathogenic Avian Influenza)"
                    description="Learn about the impact of HPAI on food security and public health."
                    feedbackUrl="https://forms.gle/DgcXdU2gKgH2SARK9"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="mb-10 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <AccordionItem value="fg3">
            <AccordionTrigger className="px-2 py-3 font-semibold text-left text-lg text-gray-800 items-center hover:no-underline gap-2">
              <SessionHeader
                headerTitle="Focus Group 3 Sessions"
                headerTime="3:45 pm - 4:30 pm"
              />
            </AccordionTrigger>
            <AccordionContent>
              <section
                id="Focus Group 3 Sessions"
                className="bg-white py-4 px-2"
              >
                <div className="flex flex-col gap-6 pt-2 pb-4">
                  <FeedbackBox
                    sessionLetter="A:"
                    sessionTitle="Ethical Issues in Medicine and Public Health"
                    description="Explore ethical challenges and considerations in medicine and public health."
                    feedbackUrl="https://forms.gle/EYtEyKvqAAFgdvsr6"
                  />
                  <FeedbackBox
                    sessionLetter="B:"
                    sessionTitle="Career as a Physician Assistant"
                    description="Learn about the role and opportunities as a Physician Assistant."
                    feedbackUrl="https://forms.gle/82XnJZY3hkx7MPtK8"
                  />
                  <FeedbackBox
                    sessionLetter="C:"
                    sessionTitle="Revolutionizing Healthcare: Bridging the Gap Between Clinicians and Patients"
                    description="Discover innovative approaches to improve clinician-patient relationships."
                    feedbackUrl="https://forms.gle/R8MmkusY3RD9tJyi8"
                  />
                  <FeedbackBox
                    sessionLetter="D:"
                    sessionTitle="Focus Group on Nursing"
                    description="Explore career paths and opportunities in the nursing profession."
                    feedbackUrl="https://forms.gle/98boKp4vJE72QzR99"
                  />
                </div>
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>

      {/* Footer */}
      <footer className="bg-[#733a84] text-white py-6 px-4 text-center">
        <p className="mb-2">15th Annual Health Professions Conference</p>
        <p className="text-sm">
          For further assistance, questions, or concerns please contact{" "}
          <a
            href="mailto:crexach@mtsac.edu"
            className="underline text-blue-300 hover:text-purple-200 transition-colors"
          >
            crexach@mtsac.edu
          </a>
          .
        </p>
        <div className="flex justify-center mt-4 mb-6 space-x-8">
          <a
            href="https://www.mtsac.edu/caduceus/"
            className="underline text-sm hover:text-purple-200 transition-colors"
          >
            Club Website
          </a>
          <a
            href="https://www.instagram.com/mtsac.caduceusclub"
            className="underline text-sm hover:text-purple-200 transition-colors"
          >
            Instagram
          </a>
        </div>
        <a href="https://bentgarcia.com">
          <Image
            src="/static/favicon.svg"
            alt="Website made by Benjamin Garcia"
            width={20}
            height={20}
            loading="eager"
            className="mx-auto"
          />
        </a>
      </footer>
    </div>
  );
}
