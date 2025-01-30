"use client";
import { useState } from 'react';

export default function Guide() {

    const [expandedSections, setExpandedSections] = useState(Array(17).fill(false));

    const toggleSection = (index: number) => {
        console.log('index', index);
        const updatedSections = [...expandedSections];
        updatedSections[index] = !updatedSections[index];
        setExpandedSections(updatedSections);
    };

    const sections = [
        {
          title: '--mode',
          description: (
            <>
              Specifies the mode of input. Choose from <code>cli</code>, <code>yaml</code>, or <code>interactive</code>.
            </>
          ),
          content: (
            <div>
              <p>
                The <code>--mode</code> parameter defines how AlignAIR receives inputs. Choose between:
              </p>
              <ul className="list-disc list-inside pl-4">
                <li><b>cli</b>: Enter all parameters through the command line interface.</li>
                <li><b>yaml</b>: Use a YAML configuration file.</li>
                <li><b>interactive</b>: The script will prompt you for inputs through an interactive terminal session.</li>
              </ul>
            </div>
          ),
        },
        {
          title: '--config_file',
          description: (
            <>
              Path to the YAML configuration file (only required in <code>yaml</code> mode).
            </>
          ),
          content: (
            <div>
              <p>
                If using YAML mode, you need to provide the path to a YAML file that contains all the necessary input
                parameters. This mode is useful when you want to save and reuse configuration settings for multiple runs.
              </p>
            </div>
          ),
        },
        {
          title: '--model_checkpoint',
          description: (
            <>
              Path to the pre-trained AlignAIR model's saved weights. Required for running predictions.
            </>
          ),
          content: (
            <div>
              <p>
                This parameter points to the saved model weights. AlignAIR uses these pre-trained weights for allele
                assignment and sequence alignment.
              </p>
              <p className="important">
                <b>Note:</b> Ensure that you are using a compatible model checkpoint for the input sequences to avoid discrepancies in alignment accuracy.
              </p>
            </div>
          ),
        },
        {
          title: '--save_path',
          description: (
            <>
              Path to where the aligned sequences and results will be saved (usually in CSV format).
            </>
          ),
          content: (
            <div>
              <p>
                This parameter defines the location where the alignment results should be saved. The output typically
                includes aligned sequences and predicted allele assignments, formatted according to AIRR schema.
              </p>
            </div>
          ),
        },
        {
          title: '--chain_type',
          description: (
            <>
              Specifies the type of chain to align. Choose between <code>heavy</code> and <code>light</code>.
            </>
          ),
          content: (
            <div>
              <p>
                The chain type refers to whether you are aligning heavy chains or light chains from immunoglobulin (Ig) or
                T-cell receptors. This impacts how the sequences are processed and aligned.
              </p>
            </div>
          ),
        },
        {
          title: '--sequences',
          description: (
            <>
              Path to the sequences file (CSV, TSV, or FASTA) containing sequences to be aligned.
            </>
          ),
          content: (
            <div>
              <p>
                Provide the path to the file containing the DNA sequences to be aligned. If you are using a CSV or TSV file,
                ensure that the column containing the sequences is labeled <code>sequence</code>.
              </p>
            </div>
          ),
        },
        {
          title: '--lambda_data_config',
          description: (
            <>
              Path to the lambda chain DataConfig file. Default is <code>D</code>.
            </>
          ),
          content: (
            <div>
              <p>
                This parameter specifies the location of a custom DataConfig file for lambda chains, which contains the
                reference data needed for aligning lambda chain sequences.
              </p>
              <p><b>Default:</b> Uses GenAIRR-provided DataConfigs.</p>
            </div>
          ),
        },
        {
          title: '--kappa_data_config',
          description: (
            <>
              Path to the kappa chain DataConfig file. Default is <code>D</code>.
            </>
          ),
          content: (
            <div>
              <p>
                Like the lambda configuration, this parameter specifies the reference file for aligning kappa chain
                sequences.
              </p>
              <p><b>Default:</b> Uses GenAIRR-provided DataConfigs.</p>
            </div>
          ),
        },
        {
          title: '--max_input_size',
          description: (
            <>
              Maximum model input size in nucleotides. Default is <code>576</code>.
            </>
          ),
          content: (
            <div>
              <p>
                The maximum sequence length that the model can process is 576 nucleotides, based on the training conditions.
                Increasing this value without retraining the model could lead to inaccurate results.
              </p>
            </div>
          ),
        },
        {
          title: '--batch_size',
          description: (
            <>
              Number of sequences to process per batch. Default is <code>2048</code>.
            </>
          ),
          content: (
            <div>
              <p>
                The batch size controls how many sequences are processed simultaneously. Higher batch sizes may reduce
                runtime but increase memory usage. Adjust according to your system's capabilities.
              </p>
            </div>
          ),
        },
        {
            title: '--v_allele_threshold',
            description: (
              <>
                Threshold for V allele assignment (percentage-based). Default is <code>0.1</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  Specifies the minimum likelihood threshold for a V allele to be assigned to a sequence. Values below this threshold will not be included in the final results.
                </p>
              </div>
            ),
          },
          {
            title: '--d_allele_threshold',
            description: (
              <>
                Threshold for D allele assignment. Default is <code>0.1</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  Similar to the V allele threshold, this parameter controls the likelihood threshold for assigning D alleles.
                </p>
              </div>
            ),
          },
          {
            title: '--j_allele_threshold',
            description: (
              <>
                Threshold for J allele assignment. Default is <code>0.1</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  Specifies the likelihood threshold for J allele assignments. This parameter ensures that only alleles above a certain confidence level are included.
                </p>
              </div>
            ),
          },
          {
            title: '--v_cap',
            description: (
              <>
                Maximum number of V alleles that can be called per sequence. Default is <code>3</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  This parameter controls the upper limit on how many V alleles can be predicted for each sequence, preventing an overload of low-confidence predictions.
                </p>
              </div>
            ),
          },
          {
            title: '--d_cap',
            description: (
              <>
                Maximum number of D alleles that can be called per sequence. Default is <code>3</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  Similar to the V cap, this parameter limits how many D alleles can be predicted.
                </p>
              </div>
            ),
          },
          {
            title: '--j_cap',
            description: (
              <>
                Maximum number of J alleles that can be called per sequence. Default is <code>3</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  This parameter limits how many J alleles can be predicted for each sequence, ensuring high-confidence outputs.
                </p>
              </div>
            ),
          },
          {
            title: '--translate_to_asc',
            description: (
              <>
                Flag to translate allele names back to ASC names from IMGT format.
              </>
            ),
            content: (
              <div>
                <p>
                  Enable this option if you want to convert allele names back to ASC naming conventions, ensuring consistency with existing IMGT datasets.
                </p>
              </div>
            ),
          },
          {
            title: '--fix_orientation',
            description: (
              <>
                Preprocessing step to fix DNA orientation if reversed or complemented. Default is <code>true</code>.
              </>
            ),
            content: (
              <div>
                <p>
                  This flag adds a preprocessing step that corrects the orientation of input DNA sequences, ensuring proper alignment even if the sequences are reversed or complemented.
                </p>
              </div>
            ),
          },
          {
            title: '--custom_orientation_pipeline_path',
            description: (
              <>
                Path to a custom orientation model (optional).
              </>
            ),
            content: (
              <div>
                <p>
                  Use this parameter if you have a custom orientation model specifically trained for your dataset. This allows you to plug in a custom pipeline for DNA orientation correction.
                </p>
              </div>
            ),
          },
      ];

    return (
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
  
          <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
            <div className="max-w-3xl mx-auto pb-12 md:pb-16">
              <h1 className="h1 mb-4" data-aos="fade-up">AlignAIR Model Prediction Guide</h1>
              <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
                This guide provides a detailed explanation of how to use the AlignAIR model to align Adaptive Immune Receptor (AIR) sequences using the AlignAIR Python tool. AlignAIR is a powerful deep learning-based aligner, designed to tackle the challenges of V(D)J recombination, somatic hypermutation (SHM), and other forms of sequence corruption. By leveraging GenAIRR for unbiased training data, the AlignAIR model outperforms traditional heuristic-based aligners.
              </p>

              <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">
                After installing AlignAIR, the <code>alignair_predict</code> command should be available in your command line. Below is a step-by-step guide covering the parameters, execution modes, and examples of how to use AlignAIR effectively.
              </p>
            </div>
          </div>
  
          <div className="max-w-full mx-auto px-4 sm:px-6">
            <div className="py-12 md:py-20 border-t border-gray-800">
  
              <div className="max-w-full pb-12 md:pb-16">
                <h2 className="h2 mb-4">1. Running AlignAIR</h2>
                <p className="text-xl text-gray-400 mb-4">
                AlignAIR can be run in one of three available modes: <code>cli</code> (default), <code>yaml</code>, or <code>interactive</code>. These modes allow users to choose between command-line execution, providing a YAML configuration file, or using an interactive prompt to input the required parameters.
                </p>
                <p className="text-xl text-gray-400 mb-4">
                    For example, you can run the following command to use AlignAIR in <code>cli</code> mode:
                </p>
                
                <pre
                style={{
                    boxShadow: 'rgba(93, 93, 255, 0.5) 0px 5px, rgba(93, 93, 255, 0.3) 0px 10px',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word' 
                }}
                >
                    <code className="text-sm">
                        alignair_predict --mode cli --model_checkpoint /path/to/model \<br />
                        &nbsp;&nbsp;--sequences /path/to/sequences.csv --save_path /save/here --chain_type heavy<br />
                    </code>
                </pre>
              </div>

                <div className="max-w-full pb-12 md:pb-16">
                    <h2 className="h2 mb-4">2. Modes of Operation</h2>
                        <ul className="list-disc list-inside text-xl text-gray-400 mb-4 pl-8">
                            <li><b className="text-white">cli:</b> Command-line interface where all arguments are passed as flags. This is the most direct way to run AlignAIR.</li>
                            <li><b className="text-white">yaml:</b> YAML configuration file mode, where you provide all inputs in a structured YAML file. Use the <code>--config_file</code> argument to specify the YAML file path.</li>
                            <li><b className="text-white">interactive:</b> A user-friendly, question-and-answer interface that prompts you for input values.</li>
                        </ul>
                </div>

                <div className="max-w-6xl pb-12 md:pb-16">
                    <h2 className="h2 mb-4">3. Parameters</h2>
                    <p className="text-xl text-gray-400 mb-4">
                    The script takes several input parameters that control various aspects of the alignment process. You can provide these parameters either via the command line or in a YAML configuration file. Each parameter is designed to provide flexibility for different types of input sequences, model configurations, and output requirements.
                    </p>

                    {sections.map((section, index) => (
                        <div key={index} className="parameter mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                            <h3 className="inline text-md text-black font-bold">{section.title}</h3>
                            <p className="inline text-sm text-gray-400">{section.description}</p>
                            </div>
                            <button
                            onClick={() => toggleSection(index)}
                            className="text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
                            >
                            {expandedSections[index] ? '-' : '+'}
                            </button>
                        </div>
                        {expandedSections[index] && (
                            <div className="content mt-4 text-sm text-gray-400">
                            {section.content}
                            </div>
                        )}
                        </div>
                    ))}
                </div>
                
                <div className="max-w-full pb-12 md:pb-16">
                    <h2 className="h2 mb-4">4. Example Usage</h2>
                    <p className="text-xl text-gray-400 mb-4">
                        Here are a few examples of how you can run the AlignAIR tool:
                    </p>
                    
                    <h3 className='font-bold'>CLI Mode</h3>
                    <pre
                    style={{
                        boxShadow: 'rgba(93, 93, 255, 0.5) 0px 5px, rgba(93, 93, 255, 0.3) 0px 10px',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        marginBottom: '16px' 
                    }}
                    >
                        <code className="text-sm">
                            alignair_predict --mode cli --model_checkpoint /path/to/model \<br />
                            &nbsp;&nbsp;--save_path /output/alignment.csv --chain_type heavy \<br />
                            &nbsp;&nbsp;--sequences /data/sequences.csv --batch_size 1024 --v_allele_threshold 0.1
                        </code>
                    </pre>
                    <p>This command runs AlignAIR in CLI mode, using a pre-trained model, a heavy chain type, and a CSV file with sequences. The output is saved to <code>/output/alignment.csv</code>.</p>    
                    <br />
                    <h3 className='font-bold'>YAML Mode</h3>
                    <pre
                    style={{
                        boxShadow: 'rgba(93, 93, 255, 0.5) 0px 5px, rgba(93, 93, 255, 0.3) 0px 10px',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        marginBottom: '16px' 
                    }}
                    >
                        <code className="text-sm">
                            alignair_predict --mode yaml --config_file /path/to/config.yaml
                        </code>
                    </pre>
                    <p>This example shows how to use a YAML configuration file to input parameters.</p>    
                    <br />
                    <h3 className='font-bold'>Interactive Mode</h3>
                    <pre
                    style={{
                        boxShadow: 'rgba(93, 93, 255, 0.5) 0px 5px, rgba(93, 93, 255, 0.3) 0px 10px',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        marginBottom: '16px' 
                    }}
                    >
                        <code className="text-sm">
                            alignair_predict --mode interactive
                        </code>
                    </pre>
                    <p>This command runs AlignAIR in interactive mode, prompting the user for each required parameter.</p>    
                </div>

                <div className="max-w-full pb-12 md:pb-16">
                    <h2 className="h2 mb-4">5. Pipeline Overview</h2>
                    <p className="text-xl text-gray-400 mb-4">
                    Once the input parameters are provided, AlignAIR runs through several processing steps:
                    </p>
                    <ul className="list-disc list-inside text-xl text-gray-400 mb-4 pl-8">
                        <li><b className="text-white">cli:</b> Command-line interface where all arguments are passed as flags. This is the most direct way to run AlignAIR.</li>
                        <li><b className="text-white">ConfigLoadStep</b>: Loads the necessary configurations and prepares the system for alignment.</li>
                        <li><b className="text-white">FileNameExtractionStep</b>: Extracts relevant file names from the input sequences.</li>
                        <li><b className="text-white">ModelLoadingStep</b>: Loads the pre-trained AlignAIR model.</li>
                        <li><b className="text-white">BatchProcessingStep</b>: Processes sequences in batches according to the specified batch size.</li>
                        <li><b className="text-white">CleanAndArrangeStep</b>: Cleans and arranges the raw predictions into a structured format.</li>
                        <li><b className="text-white">SegmentCorrectionStep</b>: Corrects segmentations based on the model’s output.</li>
                        <li><b className="text-white">MaxLikelihoodPercentageThresholdApplicationStep</b>: Applies likelihood thresholds to select the best V, D, and J allele assignments.</li>
                        <li><b className="text-white">FinalizationStep</b>: Finalizes the alignment process and saves the results to the output file.</li>
                    </ul>  
                </div>

                <div className="max-w-full pb-12 md:pb-16">
                    <h2 className="h2 mb-4">6. Conclusion</h2>
                    <p className="text-xl text-gray-400 mb-4">
                    This guide covers the essential steps for running the AlignAIR model prediction script in its different modes. AlignAIR offers flexibility and power, ensuring high accuracy in aligning immunoglobulin sequences and predicting V(D)J alleles. For more advanced configurations and usage, please refer to the AlignAIR documentation or contact the developers.
                    </p> 
                </div>

            </div>
          </div>
        </div>
      </section>
    )
  }
  