'use client'

import { ValidationStatusProps } from "@/types/types";
import { CurrentModelsUsed  } from "./CurrentModelsUsed";

export const InferenceEngineStatus = ({
    status
}: ValidationStatusProps) => {
    return (
        <CurrentModelsUsed status={status}/>
    )
}