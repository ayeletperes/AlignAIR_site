docker run -u $(id -u):$(id -g) -it -v /home/bcrlab/peresay/HeavyChainAlignAIR_WithIndel:/home -v /localdata/alignairr_data/:/localdata tensorflowjs_docker tensorflowjs_converter     --input_format=tf_saved_model     --output_format=tfjs_graph_model     --signature_name=serving_default     --saved_model_tags=''    /home/     /home/tfjs/AlignAIRR