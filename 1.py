import base64

# 打开图片文件并读取其二进制内容
with open("D:\Front\AIcert-web\sample00.png", "rb") as image_file:
    # 对图片二进制内容进行base64编码
    encoded_string = base64.b64encode(image_file.read())

# 将编码后的字节串转换为字符串
encoded_string = encoded_string.decode("utf-8")

# 打印结果
print(encoded_string)