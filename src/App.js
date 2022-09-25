import { Button, Form, Table } from "react-bootstrap";
import Axios from 'axios'
import { useState, useRef } from 'react'


function App() {

  const [tokenData, setTokenData] = useState({})
  const [accLogin, setAcclogin] = useState(false)
  const [projectData, setProjectData] = useState([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(0)
  const [itemPerPage] = useState(5)

  const username = useRef()
  const password = useRef()

  const onLogin = () => {
    let userInput = username.current.value
    let passInput = password.current.value
    username.current.value && password.current.value ?
      Axios.post('https://frontend-test-backend.tritronik.com/Auth/login', {
        username: `${userInput}`,
        password: `${passInput}`
      })
        .then(res => {
          setTokenData(res.data)
          setAcclogin(true)
        })
        .catch(err => alert('maaf input yg anda masukkan salah'))
      :
      alert('mohon lengkapi semua data')
  }

  const onShowProject = (token) => {
    Axios.get('https://frontend-test-backend.tritronik.com/v1/projects/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProjectData(res.data.content)
        setMaxPage(Math.ceil((res.data.content.length) / itemPerPage))
      })
  }

  const showTableBody = () => {
    let beginIndex = (page - 1) * itemPerPage
    let currentProject = projectData.slice(beginIndex, beginIndex + itemPerPage)
    return (
      <tbody>
        {currentProject.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.owner}</td>
              <td>
                <Button variant='warning'>Edit</Button>
                <Button variant='danger'>Hapus</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  const onNext = () => {
    setPage(page + 1 )
  }

  const onPrev = () => {
    setPage(page - 1)
  }

  if (accLogin === true) {
    return (
      <div>
        <Button variant='success' onClick={() => onShowProject(tokenData.access_token)}>Tampilkan Daftar Project</Button>
        <Table bordered striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Pemilik</th>
              <th>Opsi</th>
            </tr>
          </thead>
          {showTableBody()}
        </Table>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2%' }}>
          <Button disabled={page <= 1 ? true : false} onClick={onPrev}>prev</Button>
          <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>Page {page} of {maxPage}</div>
          <Button disabled={page >= maxPage ? true : false} onClick={onNext}>next</Button>
        </div>
      </div>
    )
  } else {
    return (
      <div >
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Masukkan Username" ref={username} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Masukkan Password" ref={password} />
          </Form.Group>

          <Button variant="primary" onClick={onLogin}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

export default App;
