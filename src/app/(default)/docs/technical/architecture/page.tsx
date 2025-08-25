export const metadata = {
  title: 'Model Architecture | AlignAIR Docs',
  description: 'Learn about the deep learning architecture behind AlignAIR.'
};

export default function ArchitecturePage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4">Model Architecture</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              AlignAIR leverages a multi-task deep residual convolutional architecture to simultaneously predict V, D, and J segmentation, allele classification, mutation rates, and productivity.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300 space-y-10">
          <div>
            <h2 className="h2 mb-4">Input Representation</h2>
            <p>
              DNA sequences are integer-encoded and tokenized into fixed-length windows (default: 576 nt).
              Each nucleotide is embedded into a learned continuous representation. The embedded input is passed through multiple 1D convolutional layers.
            </p>
          </div>

          <div>
            <h2 className="h2 mb-4">Residual Convolutional Stack</h2>
            <p>
              The backbone of the network is a series of residual blocks with dilated 1D convolutions. This design ensures both local and global context capture without excessive depth. Batch normalization and dropout are used for regularization.
            </p>
            <p className="mt-2">
              The network is symmetric and preserves sequence length, allowing predictions at each nucleotide position.
            </p>
          </div>

          <div>
            <h2 className="h2 mb-4">Multi-Task Output Heads</h2>
            <p>
              The model branches into multiple heads:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>V/D/J segmentation:</strong> Start and end coordinates for each gene segment.</li>
              <li><strong>Allele classification:</strong> Likelihood distribution over known V, D, and J alleles.</li>
              <li><strong>Mutation rate:</strong> A regression head to estimate per-sequence mutation level.</li>
              <li><strong>Productivity prediction:</strong> Binary classification to determine if the sequence is productive.</li>
            </ul>
          </div>

          <div>
            <h2 className="h2 mb-4">Loss Function Design</h2>
            <p>
              AlignAIR optimizes a composite loss function combining:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Cross-entropy for allele classification</li>
              <li>IoU-style regression loss for segmentation</li>
              <li>MSE loss for mutation prediction</li>
              <li>Binary cross-entropy for productivity</li>
            </ul>
            <p className="mt-2">
              All losses are normalized and weighted to prevent dominance of any single task.
            </p>
          </div>

          <div>
            <h2 className="h2 mb-4">Efficiency and Parallelization</h2>
            <p>
              The convolutional architecture enables efficient GPU utilization and allows processing of thousands of sequences in parallel using large batch sizes. Model inference is fully parallelized over batch and sequence dimensions.
            </p>
          </div>

          <div>
            <h2 className="h2 mb-4">References</h2>
            <p>
              For a schematic and exact implementation details, see Supplementary Figure 2 and Section 1.4 of the AlignAIR manuscript.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
