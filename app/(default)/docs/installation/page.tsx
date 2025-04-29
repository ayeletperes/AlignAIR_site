export const metadata = {
  title: 'Installation | AlignAIR Docs',
  description: 'How to install and run AlignAIR using Docker or local installation.',
}

// Template for the Installation page styled like your About page
export default function InstallationPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">Installation</h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              AlignAIR is easy to set up using Docker (recommended) or locally (advanced users).
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20 border-t border-gray-800">

            {/* Section: Docker Installation */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Docker Installation (Recommended)</h2>
              <p className="text-xl text-gray-400 mb-4">
                The easiest way to run AlignAIR is via Docker. No manual setup needed.
              </p>
              <div className="text-left">
                <p className="text-gray-400 mb-2 font-semibold">1. Pull the Docker image:</p>
                <pre className="bg-gray-800 text-green-400 p-4 rounded mb-6 overflow-x-auto">
                  <code>docker pull thomask90/alignair:latest</code>
                </pre>

                <p className="text-gray-400 mb-2 font-semibold">2. Run the container:</p>
                <pre className="bg-gray-800 text-green-400 p-4 rounded mb-6 overflow-x-auto">
                  <code>docker run -it --rm -v /path/to/local/data:/data thomask90/alignair:latest</code>
                </pre>

                <p className="text-gray-400 mt-6">
                  📦 <strong>Tip:</strong> Mount your local folder into <code className="bg-gray-700 px-1 rounded">/data</code> inside the container.
                </p>
              </div>
            </div>

            {/* Section: Prerequisites */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Prerequisites</h2>
              <p className="text-xl text-gray-400 mb-4">
                🚀 For best performance, we recommend:
              </p>
              <ul className="text-gray-400 text-left list-disc list-inside space-y-2">
                <li>NVIDIA GPU with CUDA 11 support (CPU also works, but slower)</li>
                <li>Docker installed and configured</li>
              </ul>
            </div>

            {/* Section: Local Installation */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Local Installation (Advanced)</h2>
              <p className="text-xl text-gray-400 mb-4">
                Prefer building from source? You can manually install AlignAIR locally:
              </p>
              <div className="text-left">
                <pre className="bg-gray-800 text-green-400 p-4 rounded mb-6 overflow-x-auto">
                  <code>git clone https://github.com/MuteJester/AlignAIR.git</code>
                </pre>
                <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
                  <code>cd AlignAIR<br/>pip install -r requirements.txt</code>
                </pre>
              </div>
              <p className="text-gray-400 mt-6">
                🛠️ This method requires a properly configured Python environment and is recommended for developers only.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
