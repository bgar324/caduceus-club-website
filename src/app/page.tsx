import FeedbackBox from "./FeedbackBox";

export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <section className="relative min-h-[70vh] bg-[#733a84] flex items-center justify-center">
        <div className="text-center">
          <img
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
            Scroll down to find to find your session and submit feedback.
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

      <main className="relative z-20 bg-white rounded-t-xl -mt-6 h-auto px-4 md:px-64 py-8 w-full">
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
              href="https://forms.google.com/keynote-feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-[#733a84] text-white text-center rounded-lg font-medium hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Provide Feedback
            </a>
          </div>
        </section>

        <section id="A" className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300  border border-gray-100">
            <div className="flex items-center mx-auto">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                <div className="bg-[#733a84] text-white tracking-wide px-4 py-2.5 rounded-lg flex items-center justify-center font-semibold text-base shadow-md whitespace-nowrap">
                  <span className="mr-1.5 font-bold">A:</span> 8:00 - 9:00 AM
                </div>
                <span className="text-gray-800 text-xl font-medium truncate tracking-wide">
                  Keynote
                </span>
              </div>
              <div className="flex-grow h-0.5 bg-[#733a84] ml-6"></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <FeedbackBox 
              title="Keynote Address: Future of Healthcare"
              description="Join Dr. Sarah Johnson for an inspiring talk on emerging healthcare trends and opportunities."
              feedbackUrl="https://forms.google.com/keynote-feedback"
            />
            
            <FeedbackBox 
              title="Medical School Application Workshop"
              description="Learn essential tips for crafting a successful medical school application from admissions experts."
              feedbackUrl="https://forms.google.com/med-school-workshop"
            />
            
          </div>
        </section>

        <section id="B" className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300  border border-gray-100">
            <div className="flex items-center mx-auto">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                <div className="bg-[#733a84] text-white px-4 py-2.5 tracking-wide rounded-lg flex items-center justify-center font-semibold text-base shadow-md whitespace-nowrap">
                  <span className="mr-1.5 font-bold">B:</span> 9:30 - 10:30 AM
                </div>
                <span className="text-gray-800 text-xl font-medium truncate tracking-wide">
                  First Session
                </span>
              </div>
              <div className="flex-grow h-0.5 bg-[#733a84] ml-6"></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <FeedbackBox 
              title="Healthcare Technology Innovation"
              description="Explore cutting-edge technologies transforming patient care and medical practice."
              feedbackUrl="https://forms.google.com/tech-innovation"
            />
            
            <FeedbackBox 
              title="Public Health Careers Panel"
              description="Learn about diverse opportunities in public health from professionals in the field."
              feedbackUrl="https://forms.google.com/public-health"
            />
            
            <FeedbackBox 
              title="Pharmacy School Preparation"
              description="Essential information for pre-pharmacy students about application requirements and career paths."
              feedbackUrl="https://forms.google.com/pharmacy-prep"
            />
            
          </div>
        </section>

        <section id="C" className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300  border border-gray-100">
            <div className="flex items-center mx-auto">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
                <div className="bg-[#733a84] text-white px-4 py-2.5 tracking-wide rounded-lg flex items-center justify-center font-semibold text-base shadow-md whitespace-nowrap">
                  <span className="mr-1.5 font-bold">C:</span> 11:00 - 12:00 PM
                </div>
                <span className="text-gray-800 text-xl font-medium truncate tracking-wide">
                  Second Session
                </span>
              </div>
              <div className="flex-grow h-0.5 bg-[#733a84] ml-6"></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <FeedbackBox 
              title="Allied Health Professions Showcase"
              description="Discover careers in physical therapy, occupational therapy, and other allied health fields."
              feedbackUrl="https://forms.google.com/allied-health"
            />
          
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#733a84] text-white py-6 px-4 text-center">
        <p className="mb-2">
          ben © 2025 15th Annual Health Professions Conference
        </p>
        <p className="text-sm">
          For assistance, please contact{" "}
          <a href="mailto:crexach@mtsac.edu" className="underline">
            crexach@mtsac.edu
          </a>
        </p>
        <div className="flex justify-center mt-4 space-x-4">
          <a
            href="https://linktr.ee/mtsaccaduceusclub"
            className="underline text-sm hover:text-purple-200 transition-colors"
          >
            linktr.ee
          </a>
          <a
            href="https://www.mtsac.edu/caduceus/"
            className="underline text-sm hover:text-purple-200 transition-colors"
          >
            club website
          </a>
        </div>
      </footer>
    </div>
  );
}
