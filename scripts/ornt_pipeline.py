import skl2onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, Int64TensorType, StringTensorType
import pickle

data_path = "/home/ayelet/Dropbox (BIU)/AlignAIR/src/AlignAIR/PretrainedComponents/Human_TCRB_HeavyChain_DNA_Orientation_Pipeline.pkl"
with open(data_path, 'rb') as h:
    pl =pickle.load(h)

# Define the input shape - sklearn text pipelines expect string sequences
initial_type = [('string_input', StringTensorType([None, 1]))]
onnx_model = convert_sklearn(pl, initial_types=initial_type)
with open("/home/ayelet/Documents/AlignAIR_site/public/models/orientation/trbchain_ornt_pipeline.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())