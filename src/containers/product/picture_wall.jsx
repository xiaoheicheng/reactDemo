import { Upload, Icon, Modal, message } from 'antd';
import {Component} from 'react'

import { BASE_URL } from '../../config';
import { reqDelImg } from '../../api';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  setFileList = (imgArr)=>{
    let fileList = []
    imgArr.forEach((item, index)=>{
      let temp = {}
      temp.uid = index
      temp.url = `${BASE_URL}/upload/${item}`
      temp.name = item
      fileList.push(temp)
    })
    this.setState({fileList})
  }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList }) => {
    if(file.status === 'done'){
      console.log("!!!", file);
      fileList[fileList.length - 1].name = file.response.data.name
    }
    if(file.status === 'removed'){
      console.log("###", file);
     let res = await reqDelImg(file.name)
     const {status} = res
     if(res.status === 0) message.success("删除图片成功", 1)
     else message.error("删除图片失败", 1)
    }
    this.setState({ fileList })
  }
  getImgArr = ()=>{
    let imgArr = []
    this.state.fileList.forEach((item)=>{
      imgArr.push(item.name)
    })
    return imgArr
  }
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          method="POST"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
