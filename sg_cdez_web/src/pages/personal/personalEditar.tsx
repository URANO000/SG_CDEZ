import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { PersonalForm } from "../../components/ui/forms/PersonalRegistrarForm";
import type { ContactoResponse } from "../../services/interfaces/personalResponse";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { DocumentoResponse } from "../../services/interfaces/personalResponse";
import React, { useEffect, useState } from "react";
import { actualizarPersonal, obtenerPersonalPorId } from "../../services/personalService";
import { Button } from "@mantine/core";

export function PersonalEditar() {
    const { personalId } = useParams();
    const navigate = useNavigate();
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    const [contactosExistentes, setContactosExistentes] = useState<ContactoResponse[]>([]);
    const [contactosCrear, setContactosCrear] = useState<ContactoCreateRequest[]>([]);
    const [contactosDesactivar, setContactosDesactivar] = useState<number[]>([]);

    const [documentosExistentes, setDocumentosExistentes] = useState<DocumentoResponse[]>([]);
    const [documentosDesactivar, setDocumentosDesactivar] = useState<number[]>([]);
    const [documentosCrear, setDocumentosCrear] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        rol: 0,
        especialidad: "",
        tipoIdentificacion: "",
        identificacion: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        direccion: "",
        carnet: "",
        usuario: ""
    });

    useEffect(() => {
        if (!personalId) return;

        const cargarPersonal = async () => {
            try {
                setLoadingData(true);

                const personal = await obtenerPersonalPorId(personalId);

                setFormData({
                    rol: personal.rol.id,
                    especialidad: personal.especialidad,
                    tipoIdentificacion: personal.tipoIdentificacion,
                    identificacion: personal.identificacion,
                    primerNombre: personal.primerNombre,
                    segundoNombre: personal.segundoNombre,
                    primerApellido: personal.primerApellido,
                    segundoApellido: personal.segundoApellido,
                    direccion: personal.direccion,
                    carnet: personal.carnet,
                    usuario: personal.usuario
                });

                setContactosExistentes(personal.contactos ?? []);
                setContactosCrear([]);
                setContactosDesactivar([]);

                setDocumentosExistentes(personal.documentos ?? []);
                setDocumentosCrear([]);
                setDocumentosDesactivar([]);

            } catch (error) {
                console.error(error);
                alert("No se pudo cargar el personal.");
            } finally {
                setLoadingData(false);
            }
        };

        cargarPersonal();
    }, [personalId]);

    const actualizarCampo = (
        campo: keyof typeof formData,
        valor: string
    ) => {

        setFormData(prev => ({
            ...prev,
            [campo]:
                campo === "rol"
                    ? Number(valor)
                    : valor
        }));

    };

    const actualizarContactoExistente = (
        index: number,
        campo: keyof ContactoResponse,
        valor: string
    ) => {

        setContactosExistentes(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? {
                        ...contacto,
                        [campo]: valor
                    }
                    : contacto
            )
        );
    };
    const eliminarContactoExistente = (
        contactoId: number
    ) => {

        setContactosExistentes(prev =>
            prev.filter(
                contacto =>
                    contacto.contactoId !== contactoId
            )
        );

        setContactosDesactivar(prev =>
            prev.includes(contactoId)
                ? prev
                : [...prev, contactoId]
        );
    };
    const agregarContacto = () => {

        setContactosCrear(prev => [
            ...prev,
            {
                tipoValor: "",
                valor: ""
            }
        ]);
    };
    const actualizarContactoNuevo = (
        index: number,
        campo: keyof ContactoCreateRequest,
        valor: string
    ) => {

        setContactosCrear(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? {
                        ...contacto,
                        [campo]: valor
                    }
                    : contacto
            )
        );
    };
    const eliminarContactoNuevo = (
        index: number
    ) => {

        setContactosCrear(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const eliminarDocumentoExistente = (
        documentoId: number
    ) => {

        setDocumentosExistentes(prev =>
            prev.filter(
                documento =>
                    documento.documentoId !== documentoId
            )
        );

        setDocumentosDesactivar(prev => [
            ...prev,
            documentoId
        ]);
    };

    const manejarDocumentos = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files) return;

        setDocumentosCrear(
            Array.from(e.target.files)
        );
    };

    const eliminarDocumentoNuevo = (
        index: number
    ) => {

        setDocumentosCrear(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!personalId) return;

        setLoading(true);

        try {
            const request = {
                rol: formData.rol,
                especialidad: formData.especialidad,
                tipoIdentificacion: formData.tipoIdentificacion,
                identificacion: formData.identificacion,
                primerNombre: formData.primerNombre,
                segundoNombre: formData.segundoNombre,
                primerApellido: formData.primerApellido,
                segundoApellido: formData.segundoApellido,
                direccion: formData.direccion,
                carnet: formData.carnet,
                usuario: formData.usuario,

                contactosActualizar:
                    contactosExistentes.map(
                        contacto => ({
                            contactoId: contacto.contactoId,
                            valor: contacto.valor,
                            tipoValor: contacto.tipoValor
                        })
                    ),
                contactosDesactivar,
                contactosCrear,
                documentosDesactivar
            };

            const formDataMultipart = new FormData();
            formDataMultipart.append("personal", new Blob(
                [
                    JSON.stringify(request)
                ],
                {
                    type: "application/json"
                }
            ));

            documentosCrear.forEach(
                documento => {
                    formDataMultipart.append(
                        "documentosCrear",
                        documento
                    );
                }
            );

            await actualizarPersonal(personalId, formDataMultipart);
            alert("Personal actualizado con éxito");

            navigate(`/personal`);

        } catch (error) {
            console.error(error);

            alert("No se pudo actualizar el personal.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {

        return (
            <div>
                Cargando información...
            </div>
        );

    }


    return (

        <div>
            <PersonalForm title="Editar Personal" subtitle="Edición de personal y sus componentes." onSubmit={handleSubmit}>
                <label>Primer Nombre</label>
                <input type="text" value={formData.primerNombre} onChange={e => actualizarCampo("primerNombre", e.target.value)} required />
                <label>Segundo Nombre</label>
                <input type="text" value={formData.segundoNombre} onChange={e => actualizarCampo("segundoNombre", e.target.value)} />
                <label>Primer Apellido</label>
                <input type="text" value={formData.primerApellido} onChange={e => actualizarCampo("primerApellido", e.target.value)} required />

                <label>Tipo Identificacion</label>
                <select value={formData.tipoIdentificacion} onChange={e => actualizarCampo("tipoIdentificacion", e.target.value)} required>
                    <option value="" disabled>Tipo de Identificación</option>
                    <option value="CIC">CIC</option>
                    <option value="CRP">CRP</option>
                    <option value="CRR">CRR</option>
                    <option value="RE">RE</option>
                    <option value="APO">APO</option>
                    <option value="CRT">CRT</option>
                    <option value="CRE">CRE</option>
                    <option value="PEX">PEX</option>
                </select>
                <label>Identificación</label>
                <input type="text" value={formData.identificacion} onChange={e => actualizarCampo("identificacion", e.target.value)} required />

                <label>Carné</label>
                <input type="text" value={formData.carnet} onChange={e => actualizarCampo("carnet", e.target.value)} />

                <label>Dirección</label>
                <input type="text" value={formData.direccion} onChange={e => actualizarCampo("direccion", e.target.value)} />

                <label>Usuario</label>
                <input type="text" value={formData.usuario} onChange={e => actualizarCampo("usuario", e.target.value)} />

                <hr />
                <h3>Contactos</h3>
                <button type="button" onClick={agregarContacto}>
                    + Nuevo Contacto
                </button>

                {
                    contactosExistentes.map(
                        (contacto, index) => (
                            <div key={contacto.contactoId}>
                                <h4>Contacto {index + 1}</h4>
                                <label>Tipo</label>

                                <select
                                    value={
                                        contacto.tipoValor
                                    }
                                    onChange={e =>
                                        actualizarContactoExistente(
                                            index,
                                            "tipoValor",
                                            e.target.value
                                        )
                                    }
                                    required>
                                    <option value="" disabled>Seleccionar</option>
                                    <option value="TELEFONO"> Número Telefónico</option>
                                    <option value="CORREO">Correo Electrónico</option>
                                </select>

                                <label>Contacto</label>
                                <input
                                    type="text"
                                    value={
                                        contacto.valor
                                    }
                                    onChange={e =>
                                        actualizarContactoExistente(
                                            index,
                                            "valor",
                                            e.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        eliminarContactoExistente(
                                            contacto.contactoId
                                        )
                                    }
                                >
                                    X
                                </button>
                            </div>
                        )
                    )
                }
                {contactosCrear.map(
                    (contacto, index) => (

                        <div key={`nuevo-${index}`}>

                            <h4>
                                Nuevo contacto
                            </h4>


                            <label>
                                Tipo
                            </label>

                            <select
                                value={
                                    contacto.tipoValor
                                }
                                onChange={e =>
                                    actualizarContactoNuevo(
                                        index,
                                        "tipoValor",
                                        e.target.value
                                    )
                                }
                                required>

                                <option value="" disabled>Seleccionar </option>

                                <option value="TELEFONO">
                                    Número Telefónico
                                </option>

                                <option value="CORREO">
                                    Correo Electrónico
                                </option>

                            </select>


                            <label> Contacto </label>

                            <input
                                type="text"
                                value={
                                    contacto.valor
                                }
                                onChange={e =>
                                    actualizarContactoNuevo(
                                        index,
                                        "valor",
                                        e.target.value
                                    )
                                }
                                required />

                            <button
                                type="button"
                                onClick={() =>
                                    eliminarContactoNuevo(
                                        index
                                    )
                                }
                            >
                                X
                            </button>

                        </div>

                    )
                )}
                <hr />
                <h3>Documentos Adjuntos</h3>
                <h4>Documentos Actuales</h4>
                {documentosExistentes.map(
                    documento => (

                        <div key={documento.documentoId}>
                            <span>{documento.nombreArchivo}</span>
                            <button type="button" onClick={() => documento.documentoId != null && eliminarDocumentoExistente(documento.documentoId)}> X </button>
                        </div>
                    )
                )}

                <h4>Agregar documentos</h4>
                <input type="file" multiple accept=".png, .jpg, .jpeg, .pdf" onChange={manejarDocumentos} />
                {documentosCrear.length > 0 && (

                    <div>
                        <h4> Nuevos documentos</h4>
                        {documentosCrear.map(
                            (documento, index) => (

                                <div key={index}>

                                    <span>
                                        {documento.name}
                                    </span>

                                    <button type="button" onClick={() => eliminarDocumentoNuevo(index)}> X </button>

                                </div>

                            )
                        )}

                    </div>

                )}

                <Button type="submit" loading={loading}>Guardar cambios</Button>

            </PersonalForm>

        </div>
    )
}