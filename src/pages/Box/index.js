import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';

import './styles.css';
import logo from '../../assets/logo.svg';

export default class Box extends Component {
  state = { box: {} };

  async componentDidMount() {
    this.subscribeToNewFiles();
    const id = this.props.match.params.id;
    const response = await api.get(`boxes/${id}`);

    this.setState({ box: response.data });
  }

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();

      data.append('file', file);
      const id = this.props.match.params.id;
      api.post(`boxes/${id}/files`, data);
    });
  };

  subscribeToNewFiles = () => {
    const id = this.props.match.params.id;
    const io = socket('https://omnistackdropbox.herokuapp.com');

    io.emit('connectRoom', id);

    io.on('file', data => {
      console.log(data);
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files] } });
    });
  };

  render() {
    const { box } = this.state;

    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Araste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {box.files &&
            box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blak">
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>

                <span>há {distanceInWords(file.createdAt, new Date(), { locale: pt })}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
