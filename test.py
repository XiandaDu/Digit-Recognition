import onnx


def is_onnx_model_valid(path):
    model = onnx.load(path)
    try:
        onnx.checker.check_model(model)
    except onnx.checker.ValidationError:
        return False
    return True


print(is_onnx_model_valid('model.onnx'))