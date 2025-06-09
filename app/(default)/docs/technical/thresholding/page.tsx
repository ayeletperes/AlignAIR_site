export const metadata = {
  title: 'Thresholding Logic | AlignAIR Docs',
  description: 'Details of the likelihood thresholding logic used in AlignAIR.',
};

export default function ThresholdingPage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <h1 className="h1 mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Thresholding Logic
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              AlignAIR uses a dynamic thresholding strategy to convert model likelihood outputs into final allele calls. This post-processing step ensures robustness while maintaining alignment accuracy.
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Overview</h2>
            </div>

            <p className="text-gray-300 text-lg">
              The AlignAIR model outputs a likelihood vector for each of the V, D, and J gene segments. Each vector contains probabilities corresponding to each possible allele in the reference set. To determine the final predicted alleles, AlignAIR applies a <strong className="text-purple-400">Maximum Likelihood Thresholding</strong> method followed by a <strong className="text-purple-400">cap enforcement</strong> procedure.
            </p>
          </div>
        </div>

        {/* Algorithm Visualization */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Thresholding Algorithm</h2>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="grid md:grid-cols-2 gap-8">

              {/* Algorithm Steps */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Algorithm Steps</h3>
                <div className="space-y-4">

                  <div className="bg-black rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                      <h4 className="text-white font-medium">Input Likelihood Vector</h4>
                    </div>
                    <div className="text-gray-300 text-sm">
                      For each segment (V, D, J), let the output vector be <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">p = [p₁, ..., pₙ]</code>
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                      <h4 className="text-white font-medium">Find Maximum</h4>
                    </div>
                    <div className="text-gray-300 text-sm">
                      Compute the maximum likelihood: <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">p_max = max(p)</code>
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                      <h4 className="text-white font-medium">Calculate Threshold</h4>
                    </div>
                    <div className="text-gray-300 text-sm">
                      Define threshold: <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">threshold = Φ × p_max</code>
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                      <h4 className="text-white font-medium">Filter Alleles</h4>
                    </div>
                    <div className="text-gray-300 text-sm">
                      Keep all <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">pᵢ</code> such that <code className="bg-gray-800 text-purple-400 px-2 py-1 rounded">pᵢ ≥ threshold</code>
                    </div>
                  </div>

                  <div className="bg-black rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                      <h4 className="text-white font-medium">Apply Cap</h4>
                    </div>
                    <div className="text-gray-300 text-sm">
                      If results exceed cap, keep only the top scoring alleles
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Example */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Example: V Allele Selection</h3>

                <div className="bg-black rounded-lg p-6 border border-gray-700">
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Input Likelihood Vector:</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">IGHV1-2*01</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-700 rounded-full mr-2">
                            <div className="w-full h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-blue-400 font-mono text-sm">0.85</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">IGHV1-3*01</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-700 rounded-full mr-2">
                            <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-green-400 font-mono text-sm">0.72</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">IGHV1-4*01</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-700 rounded-full mr-2">
                            <div className="w-1/2 h-full bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-yellow-400 font-mono text-sm">0.58</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">IGHV2-1*01</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-gray-700 rounded-full mr-2">
                            <div className="w-1/4 h-full bg-red-500 rounded-full"></div>
                          </div>
                          <span className="text-red-400 font-mono text-sm">0.23</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-sm text-gray-400 mb-2">Threshold Calculation:</div>
                    <div className="bg-gray-800 rounded p-3">
                      <div className="text-purple-400 font-mono text-sm">
                        p_max = 0.85<br/>
                        Φ = 0.75 (V threshold)<br/>
                        threshold = 0.75 × 0.85 = 0.64
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="text-sm text-gray-400 mb-2">Selected Alleles:</div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 text-sm">IGHV1-2*01 (0.85 ≥ 0.64)</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-400 text-sm">IGHV1-3*01 (0.72 ≥ 0.64)</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-red-400 text-sm">IGHV1-4*01 (0.58 &lt; 0.64)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Default Threshold Values */}
        <div className="mb-16">
          <h2 className="h2 text-center mb-12 text-white">Default Threshold Parameters</h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* V Segment */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">V</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">V Segment</h3>

                  <div className="space-y-3 text-left">
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Threshold (Φ)</div>
                      <div className="text-2xl font-bold text-blue-400">0.75</div>
                    </div>
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Default Cap</div>
                      <div className="text-2xl font-bold text-blue-400">3</div>
                    </div>
                    <div className="text-sm text-gray-300">
                      High threshold due to V region's length and conservation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* D Segment */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">D</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">D Segment</h3>

                  <div className="space-y-3 text-left">
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Threshold (Φ)</div>
                      <div className="text-2xl font-bold text-yellow-400">0.30</div>
                    </div>
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Default Cap</div>
                      <div className="text-2xl font-bold text-yellow-400">3</div>
                    </div>
                    <div className="text-sm text-gray-300">
                      Lower threshold due to D region's short length and high mutation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* J Segment */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-0.5 rounded-2xl">
              <div className="bg-gray-900 rounded-2xl p-6 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 p-0.5">
                    <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">J</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">J Segment</h3>

                  <div className="space-y-3 text-left">
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Threshold (Φ)</div>
                      <div className="text-2xl font-bold text-green-400">0.80</div>
                    </div>
                    <div className="bg-black rounded-lg p-3">
                      <div className="text-sm text-gray-400">Default Cap</div>
                      <div className="text-2xl font-bold text-green-400">3</div>
                    </div>
                    <div className="text-sm text-gray-300">
                      High threshold due to J region's conserved nature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Case: D Region */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-2xl p-8 border border-orange-700">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-orange-600 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">Special Case: Short-D Handling</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-orange-200 mb-6">
                  Due to the short and highly mutated nature of D segments, an additional label called <code className="bg-black text-orange-400 px-2 py-1 rounded">Short-D</code> is added to the likelihood vector.
                </p>

                <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4">Short-D Logic</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">1</div>
                      <div>
                        <div className="text-white font-medium">Detection</div>
                        <div className="text-orange-200 text-sm">If Short-D probability &gt; 0.5</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">2</div>
                      <div>
                        <div className="text-white font-medium">Suppression</div>
                        <div className="text-orange-200 text-sm">Apply penalty to other D allele predictions</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">3</div>
                      <div>
                        <div className="text-white font-medium">Consistency</div>
                        <div className="text-orange-200 text-sm">Ensures alignment between segmentation and classification</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Example Scenario</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Before Short-D Check:</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">IGHD1-1*01</span>
                        <span className="text-blue-400">0.45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">IGHD2-2*01</span>
                        <span className="text-green-400">0.38</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-300">Short-D</span>
                        <span className="text-orange-400">0.65</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-sm text-gray-400 mb-2">After Short-D Suppression:</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-400">IGHD1-1*01</span>
                        <span className="text-red-400">Suppressed</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-400">IGHD2-2*01</span>
                        <span className="text-red-400">Suppressed</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-300">Result</span>
                        <span className="text-orange-400">No D call</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intuition and Optimization */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Intuition */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-600 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="h2 mb-0 text-white">Intuition</h2>
              </div>

              <p className="text-gray-300 mb-4">
                This method captures the probabilistic nature of the model's predictions while maintaining a clear cutoff to reduce noise.
              </p>

              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Key Benefits:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Retains all plausible candidates above threshold
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Avoids arbitrary top-k selection
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Balances sensitivity and specificity
                  </li>
                </ul>
              </div>
            </div>

            {/* Optimization */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-600 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="h2 mb-0 text-white">Optimization Strategy</h2>
              </div>

              <p className="text-gray-300 mb-4">
                The optimal values of Φ and cap were selected via grid search to maximize agreement with ground truth labels.
              </p>

              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Optimization Goals:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Sensitivity</span>
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-5/6 h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Specificity</span>
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-4/5 h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Efficiency</span>
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-3/4 h-full bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="text-center">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="h2 mb-0 text-white">📖 References</h2>
            </div>
            <p className="text-gray-300">
              See supplementary section 1.5.2 in the AlignAIR manuscript for full implementation details and performance analysis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}