export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Discover the Unique Features of AlignAIR</h2>
            <p className="text-xl text-gray-400">Enhance your research with precision, speed, and unparalleled accuracy in immunoglobulin sequence alignment.</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

            {/* 1st item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
              <g transform="translate(8 8)" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd">
                <circle className="stroke-current text-purple-100" cx="24" cy="24" r="16" />
                <circle className="stroke-current text-purple-300" cx="24" cy="24" r="10" />
                <circle className="stroke-current text-purple-100" cx="24" cy="24" r="5" />
                <path className="stroke-current text-purple-300" d="M24 0v8M24 40v8M0 24h8M40 24h8" />
                <path className="stroke-current text-purple-100" d="M17 31c2-2.5 6-2.5 8 0" />
                <path className="stroke-current text-purple-100" d="M17 17c2 2.5 6 2.5 8 0" />
                <path className="stroke-current text-purple-100" d="M12 12c3 4 9 4 12 0" />
                <path className="stroke-current text-purple-100" d="M12 36c3-4 9-4 12 0" />
              </g>
            </svg>
                <h4 className="h4 mb-2">High Call Accuracy</h4>
                <p className="text-lg text-gray-400 text-center">Exceptional accuracy in allele identification ensures reliable and precise results for your research needs.</p>
              </div>

              {/* 2nd item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="100" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <circle className="fill-current text-purple-600" cx="32" cy="32" r="32" />
              <g transform="translate(16 16)" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd">
                <circle className="stroke-current text-purple-100" cx="12" cy="12" r="10" />
                <line className="stroke-current text-purple-300" x1="8" y1="8" x2="16" y2="16" strokeLinecap="round" strokeWidth="2" />
                <line className="stroke-current text-purple-300" x1="16" y1="8" x2="8" y2="16" strokeLinecap="round" strokeWidth="2" />
                <line className="stroke-current text-purple-100" x1="18" y1="18" x2="26" y2="26" strokeLinecap="round" strokeWidth="2" />
                <circle className="stroke-current text-purple-300" cx="12" cy="12" r="10" />
              </g>
            </svg>

                <h4 className="h4 mb-2">Mutation Rate Detection</h4>
                <p className="text-lg text-gray-400 text-center">Accurately estimates mutation rates and noise for deeper insights into sequence variations.</p>
              </div>

              {/* 3rd item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <circle className="fill-current text-purple-600" cx="32" cy="32" r="32" />
            <g transform="translate(12 12)" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd">
              <circle className="stroke-current text-purple-100" cx="16" cy="16" r="10" />
              <line className="stroke-current text-purple-300" x1="12" y1="12" x2="20" y2="20" strokeLinecap="round" strokeWidth="2" />
              <line className="stroke-current text-purple-300" x1="20" y1="12" x2="12" y2="20" strokeLinecap="round" strokeWidth="2" />
              <line className="stroke-current text-purple-100" x1="22" y1="22" x2="30" y2="30" strokeLinecap="round" strokeWidth="2" />
              <path className="stroke-current text-purple-100" d="M10 30s6-10 12 0" />
              <path className="stroke-current text-purple-300" d="M22 30s6-10 12 0" />
              <line className="stroke-current text-purple-100" x1="24" y1="24" x2="32" y2="32" strokeLinecap="round" strokeWidth="2" />
            </g>
          </svg>

                <h4 className="h4 mb-2">Indel Event Identification</h4>
                <p className="text-lg text-gray-400 text-center">Detects and quantifies indel events for comprehensive sequence modification insights.</p>
              </div>

              {/* 4th item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="300" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                  <g transform="translate(20 16)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                    <path className="stroke-current text-purple-100" d="M16 1L8 14h6l-4 13L22 14h-6z" />
                  </g>
                </svg>

                <h4 className="h4 mb-2">Unparalleled Speed</h4>
                <p className="text-lg text-gray-400 text-center">Processes sequences faster than other aligners, enabling timely and effective research.</p>
              </div>

              {/* 5th item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="400" data-aos-anchor="[data-aos-id-blocks]">
                <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                  <g strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                    <path className="stroke-current text-purple-100" d="M29 42h10.229a2 2 0 001.912-1.412l2.769-9A2 2 0 0042 29h-7v-4c0-2.373-1.251-3.494-2.764-3.86a1.006 1.006 0 00-1.236.979V26l-5 6" />
                    <path className="stroke-current text-purple-300" d="M22 30h4v12h-4z" />
                  </g>
                </svg>
                <h4 className="h4 mb-2">Accurate Segment Estimate</h4>
                <p className="text-lg text-gray-400 text-center">Precisely detects gene start and end points, ensuring accurate sequence segmentation.</p>
              </div>

              {/* 6th item */}
              <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="500" data-aos-anchor="[data-aos-id-blocks]">
                <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                  <g transform="translate(21 22)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                    <path className="stroke-current text-purple-300" d="M17 2V0M19.121 2.879l1.415-1.415M20 5h2M19.121 7.121l1.415 1.415M17 8v2M14.879 7.121l-1.415 1.415M14 5h-2M14.879 2.879l-1.415-1.415" />
                    <circle className="stroke-current text-purple-300" cx="17" cy="5" r="3" />
                    <path className="stroke-current text-purple-100" d="M8.86 1.18C3.8 1.988 0 5.6 0 10c0 5 4.9 9 11 9a10.55 10.55 0 003.1-.4L20 21l-.6-5.2a9.125 9.125 0 001.991-2.948" />
                  </g>
                </svg>
                <h4 className="h4 mb-2">Productivity Check</h4>
                <p className="text-lg text-gray-400 text-center">Classifies sequences with high accuracy to determine their productivity, ensuring reliable functional assessments.</p>
              </div>


          </div>

        </div>
      </div>
    </section>
  )
}
