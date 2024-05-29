// Template for the About page of the landing page
export default function About() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">About AlignAIR</h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              AlignAIR: Enhanced Sequence Alignment of Adaptive Immune Receptors Using Multi-Task Deep Supervised Learning
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20 border-t border-gray-800">

            {/* Section 1: Introduction */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Why?</h2>
              <p className="text-xl text-gray-400 mb-4">
                The analysis of Adaptive Immune Receptor Repertoire sequencing (AIRR-seq) data is critical for understanding the dynamics of the adaptive immune system in health and disease. While many algorithms and tools are available for Immunoglobulin (Ig) sequence alignment, each exhibits specific strengths and weaknesses. AlignAIR was developed to harness a novel multi-task residual convolutional architecture along with an immunology-informed loss function to overcome these weaknesses.
              </p>
            </div>

            {/* Section 2: Key Features */}
            <div className="grid gap-12">

              {/* Feature 1 */}
              <div className="text-center">
                <h3 className="h3 mb-3">Comprehensive Sequence Analysis</h3>
                <p className="text-xl text-gray-400 mb-4">
                  AlignAIR integrates a deep residual convolutional architecture with a novel loss function and training regime, enabling effective modeling of Ig sequences. Using the immune receptor sequence simulator, GenAIRR, we generated high-quality training and validation datasets.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <h3 className="h3 mb-3">Superior Performance</h3>
                <p className="text-xl text-gray-400 mb-4">
                  AlignAIR was benchmarked against leading aligners, showing superior performance in segmentation tasks, allele classification, and productivity classification, especially under high Somatic Hypermutation (SHM) conditions. It accurately models SHM dynamics and resolves uncertainties by prioritizing alleles with higher mutability.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <h3 className="h3 mb-3">Robust Against Sequence Corruption</h3>
                <p className="text-xl text-gray-400 mb-4">
                  AlignAIR’s robust performance indicates its enhanced ability to deal with sequence corruptions and complex mutation patterns, which are often seen in clinical samples. It transcends classic alignment algorithms by integrating multiple metatasks into its latent space, allowing it to consider multiple aspects simultaneously when making an alignment.
                </p>
              </div>

            </div>

            {/* Section 3: Call to Action */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16 mt-12">
              <h2 className="h2 mb-4">Explore AlignAIR!</h2>
              <p className="text-xl text-gray-400 mb-8">
                Gain access to the beta version of our web interface and explore the innovative features that make AlignAIR a game-changer in immunogenomics. Reach out to us with any questions or suggestions for development.
              </p>
              <div className="flex justify-center mt-8">
                <div className="ml-4">
                  <a className="btn text-white bg-purple-600 hover:bg-purple-700 w-full sm:w-auto mb-4 sm:mb-0" href="http://alignair.ai/">Web Interface</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
