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
            <h1 className="h1 mb-4">Thresholding Logic</h1>
            <p className="text-xl text-gray-400 mb-8">
              AlignAIR uses a dynamic thresholding strategy to convert model likelihood outputs into final allele calls. This post-processing step ensures robustness while maintaining alignment accuracy.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-gray-300 space-y-10">
            <div>
              <h2 className="h2 mb-4">Overview</h2>
              <p>
                The AlignAIR model outputs a likelihood vector for each of the V, D, and J gene segments. Each vector contains probabilities corresponding to each possible allele in the reference set. To determine the final predicted alleles, AlignAIR applies a <strong>Maximum Likelihood Thresholding</strong> method followed by a <strong>cap enforcement</strong> procedure.
              </p>
            </div>

            <div>
              <h2 className="h2 mb-4">Algorithm</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>For each segment (V, D, J), let the output vector be <code>p = [p_1, ..., p_n]</code>.</li>
                <li>Compute the maximum likelihood: <code>p<sub>max</sub> = max(p)</code>.</li>
                <li>Define a threshold: <code>threshold = Φ × p<sub>max</sub></code>, where <code>Φ</code> is a segment-specific parameter (e.g. 0.75 for V, 0.3 for D, 0.8 for J).</li>
                <li>Filter alleles: keep all <code>p_i</code> such that <code>p_i ≥ threshold</code>.</li>
                <li>Apply cap: if the number of alleles passing the threshold exceeds a predefined cap (e.g. 3), keep only the top scoring ones.</li>
              </ol>
            </div>

            <div>
              <h2 className="h2 mb-4">Intuition</h2>
              <p>
                This method captures the probabilistic nature of the model's predictions while maintaining a clear cutoff to reduce noise. For example, if multiple alleles are highly likely, the model retains all those above the dynamic threshold, instead of arbitrarily selecting the top-k. The cap prevents the system from becoming overly permissive.
              </p>
            </div>

            <div>
              <h2 className="h2 mb-4">Optimization Strategy</h2>
              <p>
                The optimal values of <code>Φ</code> and cap were selected via grid search to maximize agreement with ground truth labels while minimizing the number of alleles returned. This creates a balance between sensitivity (returning all plausible candidates) and specificity (not returning noise).
              </p>
            </div>

            <div>
              <h2 className="h2 mb-4">Special Case: D Region</h2>
              <p>
                Due to the short and highly mutated nature of D segments, an additional label called <code>Short-D</code> is added to the likelihood vector. If this label receives high probability (&gt; 0.5), the model suppresses other D allele predictions using a penalty term. This ensures consistency between segmentation and classification, avoiding spurious allele calls when the D region is unreliable.
              </p>
            </div>

            <div>
              <h2 className="h2 mb-4">References</h2>
              <p>
                See supplementary section 1.5.2 in the AlignAIR manuscript for full implementation details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
