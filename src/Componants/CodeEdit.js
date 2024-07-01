import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/ext-language_tools';

export const CodeEdit = ({ selectedOption, onChange, value }) => {
  const [initial, setInitial] = useState('');

  useEffect(() => {
    if (selectedOption === 'python') {
      setInitial('# program');
    } else {
      setInitial('// program');
    }
  }, [selectedOption]);

  return (
    <AceEditor
      mode={selectedOption}
      theme="cobalt"
      name="editor"
      editorProps={{ $blockScrolling: true }}
      fontSize={15}
      value={value || initial}
      onChange={onChange}
      width='600px'
      height='400px'
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
    />
  );
};
