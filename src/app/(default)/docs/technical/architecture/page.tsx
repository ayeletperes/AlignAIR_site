export const metadata = {
  title: 'Model Architecture | AlignAIR Docs',
  description: 'Learn about the deep learning architecture behind AlignAIR.'
};

const sections = [
  {
    n: '01',
    cat: 'input',
    title: 'Input representation',
    paragraphs: [
      'DNA sequences are integer-encoded and tokenized into fixed-length windows (default: 576 nt). Each nucleotide is embedded into a learned continuous representation. The embedded input is passed through multiple 1D convolutional layers.',
    ],
  },
  {
    n: '02',
    cat: 'backbone',
    title: 'Residual convolutional stack',
    paragraphs: [
      'The backbone of the network is a series of residual blocks with dilated 1D convolutions. This design ensures both local and global context capture without excessive depth. Batch normalization and dropout are used for regularization.',
      'The network is symmetric and preserves sequence length, allowing predictions at each nucleotide position.',
    ],
  },
];

export default function ArchitecturePage() {
  return (
    <section className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">

        {/* Hero */}
        <div className="pt-16 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-3">
            // technical / architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4">
            Model Architecture
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            AlignAIR uses a multi-task deep residual convolutional architecture to simultaneously predict V/D/J segmentation, allele classification, mutation rates, and productivity.
          </p>
        </div>

        <div className="py-12 space-y-12 text-gray-700 dark:text-gray-300 leading-relaxed">

          {sections.map((s) => (
            <section key={s.n}>
              <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// {s.n} / {s.cat}</div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{s.title}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-3' : ''}>{p}</p>
              ))}
            </section>
          ))}

          <section>
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// 03 / heads</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Multi-task output heads</h2>
            <p>The model branches into multiple heads:</p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-1.5">
              <li><strong className="text-gray-900 dark:text-white">V/D/J segmentation:</strong> Start and end coordinates for each gene segment.</li>
              <li><strong className="text-gray-900 dark:text-white">Allele classification:</strong> Likelihood distribution over known V, D, and J alleles.</li>
              <li><strong className="text-gray-900 dark:text-white">Mutation rate:</strong> A regression head to estimate per-sequence mutation level.</li>
              <li><strong className="text-gray-900 dark:text-white">Productivity prediction:</strong> Binary classification to determine if the sequence is productive.</li>
            </ul>
          </section>

          <section>
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// 04 / loss</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Loss function design</h2>
            <p>AlignAIR optimizes a composite loss function combining:</p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-1.5">
              <li>Cross-entropy for allele classification</li>
              <li>IoU-style regression loss for segmentation</li>
              <li>MSE loss for mutation prediction</li>
              <li>Binary cross-entropy for productivity</li>
            </ul>
            <p className="mt-3">All losses are normalized and weighted to prevent dominance of any single task.</p>
          </section>

          <section>
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// 05 / efficiency</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Efficiency and parallelization</h2>
            <p>
              The convolutional architecture enables efficient GPU utilization and allows processing of thousands of sequences in parallel using large batch sizes. Model inference is fully parallelized over batch and sequence dimensions.
            </p>
          </section>

          <section>
            <div className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">// 06 / reference</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">References</h2>
            <p>
              For a schematic and exact implementation details, see Supplementary Figure 2 and Section 1.4 of the AlignAIR manuscript.
            </p>
          </section>

        </div>
      </div>
    </section>
  );
}
