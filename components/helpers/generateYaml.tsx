"use client";
import { useState } from "react";
import jsyaml from "js-yaml";

export default function AlignAIRForm() {
  const [formData, setFormData] = useState({
    mode: "yaml",
    config_file: "",
    model_checkpoint: "",
    save_path: "",
    chain_type: "",
    sequences: "",
    lambda_data_config: "D",
    kappa_data_config: "D",
    heavy_data_config: "D",
    max_input_size: 576,
    batch_size: 2048,
    v_allele_threshold: 0.1,
    d_allele_threshold: 0.1,
    j_allele_threshold: 0.1,
    v_cap: 3,
    d_cap: 3,
    j_cap: 3,
    translate_to_asc: false,
    fix_orientation: true,
    custom_orientation_pipeline_path: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveFormData = () => {
    const yamlData = { ...formData };
    const yamlString = jsyaml.dump(yamlData);
    const blob = new Blob([yamlString], { type: "text/yaml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alignair_config.yaml";
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">AlignAIR Model Prediction Script Parameters</h1>
      <form className="space-y-4">
        {/* Mode */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Mode:</h3>
            <p className="inline text-sm text-gray-400">Mode of input: cli, yaml, interactive</p>
          </div>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="yaml">YAML</option>
          </select>
        </div>

        {/* Config File Path */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Config File Path:</h3>
            <p className="inline text-sm text-gray-400">Path to YAML configuration file</p>
          </div>
          <input
            type="text"
            name="config_file"
            value={formData.config_file}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Model Checkpoint Path */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Model Checkpoint Path:</h3>
            <p className="inline text-sm text-gray-400">Path to saved AlignAIR weights</p>
          </div>
          <input
            type="text"
            name="model_checkpoint"
            value={formData.model_checkpoint}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Save Path */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Save Path:</h3>
            <p className="inline text-sm text-gray-400">Where to save the alignment</p>
          </div>
          <input
            type="text"
            name="save_path"
            value={formData.save_path}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Chain Type */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Chain Type:</h3>
            <p className="inline text-sm text-gray-400">heavy / light</p>
          </div>
          <input
            type="text"
            name="chain_type"
            value={formData.chain_type}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Sequences */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Sequences File Path:</h3>
            <p className="inline text-sm text-gray-400">Path to csv/tsv file with sequences</p>
          </div>
          <input
            type="text"
            name="sequences"
            value={formData.sequences}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Lambda Data Config */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="inline text-md text-white font-bold">Lambda Data Config:</h3>
            <p className="inline text-sm text-gray-400">Path to lambda chain data config</p>
          </div>
          <input
            type="text"
            name="lambda_data_config"
            value={formData.lambda_data_config}
            onChange={handleChange}
            placeholder="Leave empty if not used"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Add remaining fields similarly... */}

        <button
          type="button"
          onClick={saveFormData}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
