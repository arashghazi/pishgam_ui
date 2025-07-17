import React, { useEffect, useState } from 'react';
import Files from 'react-files'
import { toast } from 'react-toastify';
import Avatar from '../components/common/Avatar';
import { GetFile, Upload } from '../Engine/Common';
import GetDisplay from '../Engine/Lan/Context';
const FileControl = ({ settings, dropAreatitle,onChange,prop,IsReadOnly,id }) => {
    useEffect(()=>{
        if(prop?.IPV && !spath)
            getFile();
    })
    const [sfiles, setFiles] = useState();
    const [spath, setPath] = useState();
    const onFilesChange = async (files) => {
        if(!IsReadOnly && files.length > 0){
            setFiles(files[0])
            if(onChange)
                onChange(files[0],15)
        }
    }
    const onFilesError = (error, file) => {
        toast.error(error.message)
    }
    const getFile = async () => {
        let file1 = await GetFile(prop.IPV)
        let base64ImageString = Buffer.from(file1.data, 'binary').toString('base64')
        setPath(base64ImageString)
    }
    return (
        <div className="files" id={id}>
            <Files
                className={`files-dropzone ${!IsReadOnly? 'border':''}`}
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={settings ? settings.accepts : ['image/*', '.pdf', 'audio/*']}
                multiple
                maxFileSize={settings ? settings.max : 1000000}
                minFileSize={settings ? settings.min : 0}
                clickable
            >
                {!IsReadOnly?(dropAreatitle ? dropAreatitle : GetDisplay('files-dropzone')):null}
            {/* <img style={{width:'80%',height:'100%'}} src={sfiles?.length > 0 ? sfiles[0].preview.url : ''} /> */}
            <Avatar src={sfiles? sfiles.preview.url : (spath?`data:image/jpeg;base64,${spath}`:null)}
            width={200}
            size="4xl"
            rounded="circle"
            mediaClass="img-thumbnail shadow-sm"
            />
            </Files>
        </div>

    );
};

export default FileControl;