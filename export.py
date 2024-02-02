import torch
import torch.nn as nn
import torch.nn.functional as F


class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fcl = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fcl(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.softmax(x)


def export_to_onnx(model, onnx_path, input_shape=(1, 28, 28)):
    # 创建一个示例输入张量
    dummy_input = torch.randn(1, *input_shape)

    # 导出模型为ONNX格式
    torch.onnx.export(model, dummy_input, onnx_path, verbose=True)
    print(f"Model successfully exported to {onnx_path}")


if __name__ == "__main__":
    # 加载预训练的模型权重
    model = CNN()
    model.load_state_dict(torch.load('./model_weights.pth'))  # 替换成你的.pth文件路径
    model.eval()

    # 导出模型为ONNX格式
    onnx_path = "model.onnx"
    export_to_onnx(model, onnx_path)
