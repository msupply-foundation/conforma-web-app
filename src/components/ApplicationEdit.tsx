import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/client"
import updateApplicationById from '../graphql/mutations/updateApplicationById.mutation'

interface updateApplicationProps {
    id: number
    name: string
}

const ApplicationEdit: React.FC<updateApplicationProps> = (props: updateApplicationProps) => {
    const { id, name } = props
    const [values, setValues] = useState({
        id: id,
        name: name,
    })

    useEffect(() => {
        setValues({
            ...values,
            id: id,
            name: name,
        })
    }, [id, name])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target
        const val = target.value
        setValues({
            ...values,
            name: val,
        })
    }
  
    const [updateApplication, { loading, error }] = useMutation(updateApplicationById,
        {
            onCompleted: (data) => console.log("Data from mutation", data),
            onError: (error) => console.error("Error creating a post", error),
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // the mutate function also doesn't return a promise
      updateApplication({ variables: {
                            id: values.id,
                            applicationPatch: {
                                name: values.name,
                            },
                        } });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                />
                <button type="submit">Save</button>
            </form>
            {error && <p>{error.message}</p>}
        </div>
    )
}

export default ApplicationEdit
