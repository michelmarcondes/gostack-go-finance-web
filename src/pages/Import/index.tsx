import React, { useState, ReactNode, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
  UploadStatusMessage,
} from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

interface UploadFilesStatus {
  type: 'success' | 'error' | 'fileNotFound' | null;
}

const Import: React.FC<UploadFilesStatus> = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [uploadFilesStatusMsg, setUploadFilesStatusMsg] = useState<
    UploadFilesStatus
  >({ type: null });

  const history = useHistory();

  useEffect(() => {
    if (uploadedFiles.length) {
      setUploadFilesStatusMsg({ type: null });
    }
  }, [uploadedFiles]);

  async function handleUpload(): Promise<void> {
    if (uploadedFiles.length <= 0) {
      setUploadFilesStatusMsg({ type: 'fileNotFound' });
      return;
    }

    const data = new FormData();
    uploadedFiles.map(file => data.append('file', file.file));

    try {
      const response = await api.post('/transactions/import', data);
      if (response.status === 204) {
        setUploadedFiles([]);
        setUploadFilesStatusMsg({ type: 'success' });
      }
    } catch (err) {
      console.log(err.response.error);
      setUploadFilesStatusMsg({ type: 'error' });
    }
  }

  function submitFile(files: File[]): void {
    const sentFiles = files.map(
      (file): FileProps => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      }),
    );
    setUploadedFiles(sentFiles);
  }

  function renderUploadFilesStatusMessage(): ReactNode {
    let message: ReactNode;
    switch (uploadFilesStatusMsg.type) {
      case 'success':
        message = (
          <UploadStatusMessage type="success">
            Arquivos enviados com sucesso!
          </UploadStatusMessage>
        );
        break;

      case 'fileNotFound':
        message = (
          <UploadStatusMessage type="fileNotFound">
            Nenhum arquivo encontrado.
          </UploadStatusMessage>
        );
        break;

      case 'error':
        message = (
          <UploadStatusMessage type="error">
            Ocorreu um problema com o envio de arquivos!
          </UploadStatusMessage>
        );
        break;

      default:
        break;
    }
    return message;
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          {uploadFilesStatusMsg.type != null &&
            renderUploadFilesStatusMessage()}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
