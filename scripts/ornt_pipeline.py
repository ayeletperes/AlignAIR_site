import skl2onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Define the input shape
initial_type = [('float_input', FloatTensorType([None, 576]))]
onnx_model = convert_sklearn(pl, initial_types=initial_type)
with open("ornt_pipeline.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())