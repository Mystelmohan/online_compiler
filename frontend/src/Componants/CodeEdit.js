import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/ext-language_tools';

export const CodeEdit = ({ selectedOption, onChange, value }) => {
  const [initial, setInitial] = useState('');

  // Map selectedOption to Ace Editor's mode
  const getAceMode = (lang) => {
    switch (lang) {
      case 'java':
        return 'java';
      case 'c':
      case 'cpp':
        return 'c_cpp';
      default:
        return 'text';
    }
  };

  useEffect(() => {
    setInitial('// program');
  }, [selectedOption]);

  return (
    <div className="w-full h-full">
      <AceEditor
        mode={getAceMode(selectedOption)} // mapped mode
        theme="cobalt"
        name="editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={15}
        value={value || initial}
        onChange={onChange}
        width="100%"
        height="100%"
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        setOptions={{
          useWorker: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};
