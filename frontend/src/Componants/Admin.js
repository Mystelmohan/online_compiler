import axios from 'axios'
import './form.css'
import React, { useEffect, useState } from 'react'

export default function Admin() {
  const[post,setPost]=useState([])
    const[id,setId]=useState(0)
    const[name,setName]=useState('')
    const[input,setInput]=useState('')
    const[output,setOutput]=useState('')
   
    const[popup,setPopup]=useState(false)
    const[id1,setId1]=useState(0)
    const[name1,setName1]=useState('')
    const[input1,setInput1]=useState('')
    const[output1,setOutput1]=useState('')

  
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
            "id":id1,"program_name":name1,"input":input1,"output":output1
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
        "id":id,"program_name":name,"input":input,"output":output
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
            <label>Input</label>
            <input type='text' value={input} onChange={(e)=>setInput(e.target.value)}/>
            <br></br>
            <label>Output</label>
            <input type='text' value={output} onChange={(e)=>setOutput(e.target.value)}/>
            <button type='submit'>submit</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Program Name</th>
                    <th>Input</th>
                    <th>Output</th>
                    
                    
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {post.map(x=>
                  <tr key={x.id}>
                    <td>{x.id}</td>
                    <td>{x.program_name}</td>
                    <td>{x.input}</td>
                    <td>{x.output}</td>
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
            <label>Input:</label>
            <input type='text' value={input1} onChange={(e)=>setInput1(e.target.value)}/>
            <br></br>
            <label>Output:</label>
            <input type='text' value={output1} onChange={(e)=>setOutput1(e.target.value)}/>
            <br></br>

            <button type='submit'>submit</button>
        </form></div>}
    </div>
  )
}
