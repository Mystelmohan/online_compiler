import axios from 'axios'
import './form.css'
import React, { useEffect, useState } from 'react'

export default function Admin() {
  const[post,setPost]=useState([])
    const[id,setId]=useState(0)
    const[name,setName]=useState('')
    const[input1,setInput1]=useState('')
    const[output1,setOutput1]=useState('')
    const[input2,setInput2]=useState('')
    const[output2,setOutput2]=useState('')
    const[input3,setInput3]=useState('')
    const[output3,setOutput3]=useState('')
   
    const[popup,setPopup]=useState(false)
    const[id1,setId1]=useState(0)
    const[name1,setName1]=useState('')
    const[inputup1,setInputup1]=useState('')
    const[outputup1,setOutputup1]=useState('')
    const[inputup2,setInputup2]=useState('')
    const[outputup2,setOutputup2]=useState('')
    const[inputup3,setInputup3]=useState('')
    const[outputup3,setOutputup3]=useState('')

  
    const openpopup=(datas)=>{
        setPopup(true)
        setId1(datas.id)
        setName1(datas.name)
        setInput1(datas.age)
        setOutput1(datas.role)
       
    }
    const handleUpdate=()=>{
        axios.put(`http://localhost:3001/Programs/${id1}`,
        {
            "id":id1,"program_name":name1,"input1":inputup1,"output1":outputup1,"input2":inputup2,"output2":outputup2,"input3":inputup3,"output3":outputup3
        })
        .then(res=>console.log(res))
        .catch(err=>(console.log(err)))
    }
    useEffect(()=>{
        axios.get("http://localhost:3001/Programs")
        .then(res=>{setPost(res.data)})
        .catch(err=>console.log(err))
    })
    const handleSubmit=()=>{
        axios.post("http://localhost:3001/Programs",{
        "id":id,"program_name":name,"input1":input1,"output1":output1,"input2":input2,"output2":output2,"input3":input3,"output3":output3
    }
        ).then(res=>console.log(res))
        .catch(err=>(console.log(err)))
    }
    const handleDelete=(id)=>{
        axios.delete(`http://localhost:3001/Programs/${id}`)
        .then(res=>console.log(res))
        .catch(err=>(console.log(err)))
    }
  return (
    <div className='container'>
        
        <form onSubmit={handleSubmit}>
            <label>Id:</label>
            <input type='number' value={id} onChange={(e)=>setId(e.target.value)}/>
            <br></br>
            <label>Program Name:</label>
            <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
            <br></br>
            <label>Input1</label>
            <input type='text' value={input1} onChange={(e)=>setInput1(e.target.value)}/>
            <br></br>
            <label>Output1</label>
            <input type='text' value={output1} onChange={(e)=>setOutput1(e.target.value)}/>
            
            <label>Input2</label>
            <input type='text' value={input2} onChange={(e)=>setInput2(e.target.value)}/>
            <br></br>
            <label>Output2</label>
            <input type='text' value={output2} onChange={(e)=>setOutput2(e.target.value)}/>
           
            <label>Input3</label>
            <input type='text' value={input3} onChange={(e)=>setInput3(e.target.value)}/>
            <br></br>
            <label>Output3</label>
            <input type='text' value={output3} onChange={(e)=>setOutput3(e.target.value)}/>
            <button type='submit'>submit</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Program Name</th>
                    <th>Input1</th>
                    <th>Output1</th>
                    <th>Input2</th>
                    <th>Output2</th>
                    <th>Input3</th>
                    <th>Output3</th>
                    
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {post.map(x=>
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>{x.program_name}</td>
                    <td>{x.input1}</td>
                    <td>{x.output1}</td>
                    <td>{x.input2}</td>
                    <td>{x.output2}</td>
                    <td>{x.input3}</td>
                    <td>{x.output3}</td>
                    <td>
                        <button onClick={()=>openpopup(x)}>Update</button>
                        <button onClick={()=>handleDelete(x.id)} className='del'>Delete</button>
                    </td>
                  </tr>  
                    )}
            </tbody>
        </table>
        {popup &&  <div className='popup'><form onSubmit={handleUpdate}>
           
            <button onClick={()=>setPopup(false)}>X</button><label>Id:</label>
            <input type='number' value={id1} onChange={(e)=>setId1(e.target.value)}/>
            <br></br>
            <label>Name:</label>
            <input type='text' value={name1} onChange={(e)=>setName1(e.target.value)}/>
            <br></br>
            <label>Input1:</label>
            <input type='text' value={inputup1} onChange={(e)=>setInputup1(e.target.value)}/>
            <br></br>
            <label>Output1:</label>
            <input type='text' value={outputup1} onChange={(e)=>setOutputup1(e.target.value)}/>
            <br></br>
            <label>Input2:</label>
            <input type='text' value={inputup2} onChange={(e)=>setInputup1(e.target.value)}/>
            <br></br>
            <label>Output2:</label>
            <input type='text' value={outputup2} onChange={(e)=>setOutputup1(e.target.value)}/>
            <br></br>
            <label>Input3:</label>
            <input type='text' value={inputup3} onChange={(e)=>setInputup1(e.target.value)}/>
            <br></br>
            <label>Output3:</label>
            <input type='text' value={outputup3} onChange={(e)=>setOutputup1(e.target.value)}/>
            <br></br>

            <button type='submit'>submit</button>
        </form></div>}
    </div>
  )
}
