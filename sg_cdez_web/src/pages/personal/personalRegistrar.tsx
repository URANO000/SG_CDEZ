import type React from "react";
import { PersonalForm } from "../../components/ui/forms/PersonalRegistrarForm";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@mantine/core";
import { registrarPersonal } from "../../services/personalService";
import type { ContactoCreateRequest } from "../../services/interfaces/personalCreateRequest";
import type { PersonalCreateRequest } from "../../services/interfaces/personalCreateRequest";


export function PersonalRegistrar() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [documentos, setDocumentos] = useState<File[]>([]);
    const [contactos, setContactos] = useState<ContactoCreateRequest[]>([
        {
            tipoValor: "",
            valor: ""
        }
    ]);


    const eliminarContacto = (index: number) => {
        setContactos(
            contactos.filter((_, i) => i !== index)
        );
    };

    const agregarContacto = () => {
        setContactos([
            ...contactos,
            {
                tipoValor: "",
                valor: ""
            }
        ]);
    };

    const actualizarContacto = (
        index: number,
        campo: keyof ContactoCreateRequest,
        valor: string
    ) => {
        setContactos(prev =>
            prev.map((contacto, i) =>
                i === index
                    ? { ...contacto, [campo]: valor }
                    : contacto
            )
        );
    };

    const manejarDocumentos = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files) return;

        setDocumentos(Array.from(e.target.files));
    };

    const eliminarDocumento = (index: number) => {
        setDocumentos(
            documentos.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData();
            const form = e.currentTarget;

            const personal: PersonalCreateRequest = {
                rol: Number(
                    (form.elements.namedItem("rol") as HTMLInputElement).value
                ),
                especialidad:
                    (form.elements.namedItem("especialidad") as HTMLInputElement).value,
                tipoIdentificacion:
                    (form.elements.namedItem("tipoIdentificacion") as HTMLSelectElement).value,

                identificacion:
                    (form.elements.namedItem("identificacion") as HTMLInputElement).value,

                primerNombre:
                    (form.elements.namedItem("primerNombre") as HTMLInputElement).value,

                segundoNombre:
                    (form.elements.namedItem("segundoNombre") as HTMLInputElement).value,

                primerApellido:
                    (form.elements.namedItem("primerApellido") as HTMLInputElement).value,

                segundoApellido:
                    (form.elements.namedItem("segundoApellido") as HTMLInputElement).value,

                direccion:
                    (form.elements.namedItem("direccion") as HTMLInputElement).value,

                carnet:
                    (form.elements.namedItem("carnet") as HTMLInputElement).value,

                usuario:
                    (form.elements.namedItem("usuario") as HTMLInputElement).value,

                contactos
            };

            formData.append("personal", new Blob([JSON.stringify(personal)],
                {
                    type: "application/json"
                }
            )
            );

            documentos.forEach(documento => { formData.append("documentos", documento); });

            await registrarPersonal(formData);
            navigate("/personal");

        } catch (error) {
            console.error(error);

            alert(
                "Ocurrió un error al registrar el personal."
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <PersonalForm title="Registrar Personal" subtitle="Registrar nuevo miembro del personal." onSubmit={handleSubmit}>
                <h3>Información General</h3>
                <label>Primer Nombre</label>
                <input type="text" name="primerNombre" required />
                <label>Segundo Nombre</label>
                <input type="text" name="segundoNombre" />
                <label>Primer Apellido</label>
                <input type="text" name="primerApellido" required />
                <label>Segundo Apellido</label>
                <input type="text" name="segundoApellido" />

                <label>Tipo Identificacion</label>
                <select name="tipoIdentificacion" defaultValue="" required>
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
                <a>Información (Aquí una ventana modal con las siglas)</a>
                <label>Identificación</label>
                <input type="text" name="identificacion" required />
                <label>Carné</label>
                <input type="text" name="carnet" />
                <label>Dirección</label>
                <input type="text" name="direccion" />
                <label>Usuario</label>
                <input type="text" name="usuario" />
                <hr></hr>

                <h3>Roles en el centro</h3>
                <label>Rol</label>
                <select name="rol" defaultValue="" required>
                    <option value="" disabled>Seleccionar rol</option>
                    <option value='1'>Administrador</option>
                    <option value='2'>Usuario Normal</option>
                </select>

                <label>Especialidad</label>
                <select name="especialidad" defaultValue="" required>
                    <option value="" disabled>Seleccionar especialidad</option>
                    <option value="Medicina">Medicina</option>
                    <option value="Enfermería">Enfermería</option>
                    <option value="Psicología">Psicología</option>
                    <option value="Nutrición">Nutrición</option>
                    <option value="Trabajo Social">Trabajo Social</option>
                    <option value="Terapia Física">Terapia Física</option>
                    <option value="Terapia Respiratoria">Terapia Respiratoria</option>
                    <option value="Terapia de Lenguaje">Terapia de Lenguaje</option>

                </select>
                <h3>Contactos</h3>
                <button type="button" onClick={agregarContacto}>+ Nuevo contacto</button>
                {contactos.map((contacto, index) => (

                    <div key={index}>
                        <h4>
                            Contacto {index + 1}
                        </h4>

                        <label>Tipo</label>
                        <select
                            value={contacto.tipoValor}
                            onChange={e =>
                                actualizarContacto(
                                    index,
                                    "tipoValor",
                                    e.target.value
                                )
                            }
                            required>
                            <option value="" disabled>
                                Seleccionar
                            </option>

                            <option value="TELEFONO">
                                Número Telefónico
                            </option>

                            <option value="CORREO">
                                Correo Electrónico
                            </option>

                        </select>
                        <label>Contacto</label>
                        <input
                            type="text"
                            value={contacto.valor}
                            onChange={e =>
                                actualizarContacto(
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
                                eliminarContacto(index)
                            }
                        >
                            X
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // "utilizar como usuario".
                            }}
                        >
                            Utilizar como correo de usuario
                        </button>

                        <hr />
                    </div>

                ))}

                <hr />
                <h3>Documentos Adjuntos</h3>
                <label>Se pueden elegir múltiples documentos. PNG, JPG, JPEG, PDF</label>
                <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={manejarDocumentos}
                />


                {documentos.length > 0 && (
                    <div>
                        <h4>
                            Documentos seleccionados
                        </h4>
                        {documentos.map((documento, index) => (
                            <div key={index}>
                                <span>
                                    {documento.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        eliminarDocumento(index)
                                    }>
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    type="submit"
                    loading={loading}>
                    Registrar
                </Button>

            </PersonalForm>
        </div>
    )
}