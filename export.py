import torch
import main as main


def export_to_onnx(model, onnx_path, input_shape=(1, 28, 28)):
    # 创建一个示例输入张量
    dummy_input = torch.randn(1, *input_shape)

    # 导出模型为ONNX格式
    torch.onnx.export(model, dummy_input, onnx_path, verbose=True)
    print(f"Model successfully exported to {onnx_path}")


if __name__ == "__main__":
    # 加载预训练的模型权重
    model = main.CNN()
    model.load_state_dict(torch.load('./model_weights.pth'))  # 替换成你的.pth文件路径
    model.eval()

    # 导出模型为ONNX格式
    onnx_path = "model.onnx"
    export_to_onnx(model, onnx_path)
