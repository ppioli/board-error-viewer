import { useFieldArray, useFormContext } from 'react-hook-form';
import { defaultComponent } from '../model/Board';
import { ChangeEvent } from 'react';

export interface LayerEditProps {
  name: string;
}

export function LayerEdit({ name }: LayerEditProps) {
  const { control, register, setValue } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `${name}.component`, // unique name for your Field Array
    }
  );

  const updateImage = (event: ChangeEvent<any>) => {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
      setValue(`${name}.image`, reader.result)
      console.log('RESULT', reader.result)
    }
    reader.readAsDataURL(file);

  }

  return (
    <div>
      <h1>Image</h1>
      <input type="file"
             id="avatar" name="avatar"
             accept="image/png, image/jpeg" onChange={updateImage}/>
      <h1>Offset</h1>
      <input {...register( `${name}.offset.x`)}/>
      <input {...register( `${name}.offset.y`)}/>
      <h1>Scale</h1>
      <input {...register( `${name}.scale.x`)}/>
      <input {...register( `${name}.scale.y`)}/>
      <h1>Components</h1>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input
             // important to include key with field's id
            {...register(`${name}.components.${index}.id`)}
          />
          <input // important to include key with field's id
            {...register(`${name}.components.${index}.position.x`)}
          />
          <input
            // important to include key with field's id
            {...register(`${name}.components.${index}.position.y`)}
          />
        </div>
      ))}
      <button type={"button"} onClick={() => append(defaultComponent)}>+</button>
    </div>
  );
}
