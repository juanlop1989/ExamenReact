
import React, { useEffect, useState} from "react";
import axios from "axios";
import { alertaSuccess, alertaError, alertaWarning } from "../funciones";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const Categories =() => {

    const [categories, setCategories] = useState([])
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [nameModal, setNameModal] = useState("")
    const [operation, setOperation] = useState(1)

    const url = "https://api.escuelajs.co/api/v1/categories";


    //Obtener listado desde la Api
    const getCategories = async () => {               
        const response = await axios.get(url);
        setCategories(response.data)
    }

    useEffect(() => { 
        getCategories()
    })

    /**
     * Abre el modal con los atributos del Usuario,si se va Editar se cargan los datos
     * @param {number} operation - N 1 para agregar, 2 para editar
     * @param {number} id 
     * @param {string} name 
     * * @param {string} uiamge 
     */
    const openModal = (operation, id, name, image) => {
        setId("")
        setName("")
        setImage("")

        if (operation === 1){
            setNameModal("Registrar Categoría")
            setOperation(1)
        }else if (operation === 2) {
            setNameModal("Editar Categoría")
            setOperation(2)
            setId(id)
            setName(name)
            setImage(image)
        }
    }

    const enviarSolicitud = async (url, metodo, parametros = {}) =>{
        let obj = {
            method: metodo,
            url: url,
            data: parametros,
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json" 
            }
        }

        await axios(obj).then(() =>{
            let mensaje

            if (metodo === "POST") {
                mensaje = "Se guardó la categoría"
            } else if (metodo ==="PUT") {
                mensaje = "Se editó la categoría"
            }else if (metodo ==="DELETE") {
                mensaje = "Se eliminó la categoría"
            }
            alertaSuccess(mensaje)
            document.getElementById("cerrarModal").click()
            getCategories()
        }).catch((error) =>{
            alertaError(error.response.data.message)
        })
    }

    const validar = () =>{
        let payload
        let metodo
        let urlAxios

        if (name === ""){
            alertaWarning("Casilla del nombre en blanco", "nombre")
        } else if (image === ""){
            alertaWarning("Casilla de la imagen en blanco", 'imagen')
        } else{
            payload = {
                name: name,
                image: image
            }

            if(operation === 1){
                metodo = "POST"
                urlAxios = "https://api.escuelajs.co/api/v1/categories"
            }else{
                metodo = "PUT"
                urlAxios = `https://api.escuelajs.co/api/v1/categories/${id}`
            }

            enviarSolicitud(urlAxios, metodo, payload)
        }
    }



    /**
     * Proceso para eliminar un usuario
     * @param {number} id - Identificador del usuario a eliminar
     */
    const deleteCategorie = (id) =>{
        let urlDelete = `https://api.escuelajs.co/api/v1/categories/${id}`

        const MySwal = withReactContent(Swal)

        MySwal.fire({
            title: "¿Está seguro del eliminar esta categoría?", 
            icon: "question",
            text: "Esta acción eliminará la categoría permanentemente",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed){
                setId(id)
                enviarSolicitud(urlDelete, "DELETE")
            }
        }).catch((error) =>{
            alertaError(error)
        })
    }

    return(
        <div className="App">
            <div className="row mt-3">
                <div className="col-md-4 offset-md-4">
                    <div className="d-grid mx-auto">
                        <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalCategories">
                            <i className="fa-solid fa-circle-plus" /> Nueva Categoría
                        </button>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre Categoría</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="table-gruop-divider">
                                {
                                    categories.map((categories, i) => (
                                        <tr key={categories.id}>
                                            <td>{i + 1}</td>
                                            <td>{categories.name}</td>
                                            <td>
                                                <img src={categories.image} alt={`Imagen de ${categories.name}`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                            </td>
                                            <td>
                                                <button onClick={() => openModal(2, categories.id, categories.name, categories.image)} className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalCategories">
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                <button onClick={() => deleteCategorie(categories.id)} className="btn btn-danger m-1">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id="modalCategories" className="modal fade" area-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{nameModal}</label>
                            <button className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="id"></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i class="fa-solid fa-signature"></i>
                                </span>
                                <input type="text" id="nombre" className="form-control" placeholder="nombre" value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i class="fa-regular fa-image"></i>
                                </span>
                                <input type="text" id="imagen" className="form-control" placeholder="Url de la Imagen" value={image} onChange={(e) => setImage(e.target.value)}></input>
                            </div>
                            
                          
                            <div className="modal-footer">
                                <button onClick={() => validar()} className="btn btn-success">
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                                <button id="cerrarModal" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>                               
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;