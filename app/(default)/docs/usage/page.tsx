export const metadata = {
  title: 'Usage | AlignAIR Docs',
  description: 'How to use AlignAIR via Docker and the CLI interface.',
}

export default function UsagePage() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Hero section */}
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">Usage</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
              AlignAIR can be easily used through its Docker container interface, offering flexibility and speed for sequence alignment tasks.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20 border-t border-gray-300 dark:border-gray-800">

            {/* Section: Basic Usage */}
            <div className="max-w-4xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Basic Usage Example</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                After starting the AlignAIR Docker container, run the following command inside it:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400 p-4 rounded text-left overflow-x-auto mb-8">
                <code>
                  python app.py run --model-checkpoint=/app/checkpoints/IGH_S5F_576 --save-path=/data/output --chain-type=heavy --sequences=/app/tests/sample_HeavyChain_dataset.csv
                </code>
              </pre>
              <p className="text-gray-600 dark:text-gray-400">
                Modify the parameters as needed to match your input and model requirements.
              </p>
            </div>

            {/* Section: Parameters */}
            <div className="max-w-4xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Parameters Overview</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Below is a detailed description of all parameters supported by AlignAIR in CLI mode.
              </p>

              {/* Parameter Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-gray-700 dark:text-gray-400 text-left">
                  <thead className="bg-gray-200 dark:bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-700">Parameter</th>
                      <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black">
                    {/* Model Settings */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Model Settings</td></tr>
                    <tr><td className="py-2 px-4">model_checkpoint</td><td className="py-2 px-4">Path to model weights. Docker ships with <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">IGH_S5F_576</code> and <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">IGL_S5F_576</code> located in <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/app/pretrained_models/</code>.</td></tr>
                    <tr><td className="py-2 px-4">chain_type</td><td className="py-2 px-4">Specify <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">heavy</code> or <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">light</code> chain for alignment functionality.</td></tr>
                    <tr><td className="py-2 px-4">max_input_size</td><td className="py-2 px-4">Maximum input window size. Default is <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">576</code>. Longer reads are trimmed during preprocessing if needed.</td></tr>
                    <tr><td className="py-2 px-4">batch_size</td><td className="py-2 px-4">Number of sequences per batch (default: 2048). Larger values can improve runtime if resources allow.</td></tr>

                    {/* Input and Output */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Input and Output</td></tr>
                    <tr><td className="py-2 px-4">sequences</td><td className="py-2 px-4">Path to sequence file (CSV/TSV/FASTA). For tables, must have a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">sequence</code> column.</td></tr>
                    <tr><td className="py-2 px-4">save_path</td><td className="py-2 px-4">Path to save output (AIRR Schema CSV format).</td></tr>
                    <tr><td className="py-2 px-4">airr_format</td><td className="py-2 px-4">Set <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">True</code> to output full AIRR Schema. Default is essential columns only.</td></tr>

                    {/* Thresholds */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Threshold Settings</td></tr>
                    <tr><td className="py-2 px-4">v_allele_threshold</td><td className="py-2 px-4">Threshold for V allele calling (default: 0.75). <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">[See thresholding explanation]</a></td></tr>
                    <tr><td className="py-2 px-4">d_allele_threshold</td><td className="py-2 px-4">Threshold for D allele calling (default: 0.3).</td></tr>
                    <tr><td className="py-2 px-4">j_allele_threshold</td><td className="py-2 px-4">Threshold for J allele calling (default: 0.8).</td></tr>
                    <tr><td className="py-2 px-4">v_cap / d_cap / j_cap</td><td className="py-2 px-4">Maximum number of calls allowed for V/D/J alleles (default: 3).</td></tr>

                    {/* Preprocessing Options */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Preprocessing and Corrections</td></tr>
                    <tr><td className="py-2 px-4">translate_to_asc</td><td className="py-2 px-4">Output ASC alleles instead of IMGT names if set <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">True</code>. Default is <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">False</code>.</td></tr>
                    <tr><td className="py-2 px-4">fix_orientation</td><td className="py-2 px-4">Automatically corrects reverse/complement/reverse-complement orientations before alignment.</td></tr>

                    {/* Metadata Configs */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Reference Metadata and Configs</td></tr>
                    <tr><td className="py-2 px-4">heavy_data_config / kappa_data_config / lambda_data_config</td><td className="py-2 px-4">Paths to DataConfig pickle files. Default shipped models set to "D". Required for custom models.</td></tr>
                    <tr><td className="py-2 px-4">custom_orientation_pipeline_path</td><td className="py-2 px-4">Path to custom orientation model pickle. Leave empty for default models.</td></tr>
                    <tr><td className="py-2 px-4">custom_genotype</td><td className="py-2 px-4">Path to YAML file defining genotype (V/D/J allele subset to use).</td></tr>
                    <tr><td className="py-2 px-4">finetuned_model_params_yaml</td><td className="py-2 px-4">YAML specifying updated model parameters if fine-tuning has been performed.</td></tr>

                    {/* Debugging */}
                    <tr><td className="py-3 px-4 font-semibold text-gray-900 dark:text-white" colSpan={2}>Debugging Options</td></tr>
                    <tr><td className="py-2 px-4">save_predict_object</td><td className="py-2 px-4">Save the internal PredictObject containing raw predictions and intermediate states.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
