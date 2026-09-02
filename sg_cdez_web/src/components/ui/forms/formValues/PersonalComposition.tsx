import type { PersonalFormValues } from "./PersonalFormValues";
import {PersonalGeneralSection} from "./PersonalGeneralSection"
import { PersonalContactsSection } from "./PersonalContactsSection";
import type { UseFormReturnType } from "@mantine/form";
import {PersonalDocumentsSection} from "./PersonalDocumentsSection";
import {PersonalRolesSection} from "./PersonalRolesSection";
import type { PersonalExistingDocument } from "./PersonalDocumentsSection";

interface PersonalFieldsProps {
    form: UseFormReturnType<PersonalFormValues>;
    documentosExistentes?: PersonalExistingDocument[];
    documentosNuevos: File[];
    onDocumentosNuevosChange: (documentos: File[]) => void;
    onEliminarDocumentoExistente?: (
        documentoId: number
    ) => void | Promise<void>;
    disabled?: boolean;
}

export function PersonalFields({
    form,
    documentosExistentes = [],
    documentosNuevos,
    onDocumentosNuevosChange,
    onEliminarDocumentoExistente,
    disabled = false,
}: PersonalFieldsProps) {
    return (
        <>
            <PersonalGeneralSection form={form} />

            <PersonalRolesSection form={form} />

            <PersonalContactsSection form={form} />

            <PersonalDocumentsSection
                documentosExistentes={documentosExistentes}
                documentosNuevos={documentosNuevos}
                onDocumentosNuevosChange={
                    onDocumentosNuevosChange
                }
                onEliminarExistente={
                    onEliminarDocumentoExistente
                }
                disabled={disabled}
            />
        </>
    );
}