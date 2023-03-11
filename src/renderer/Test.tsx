import {
  ChangeHandler,
  FormProvider,
  SubmitHandler,
  useController,
  useForm, UseFormProps, UseFormRegister
} from 'react-hook-form';
import { RootState, useAppDispatch, useAppSelector } from './store';
import { FormUpdateActionPayload, updateBoard, updateBoardProp } from './boardEdit/boardSlice';
import { ChangeEventHandler, useCallback } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';
import _ from 'lodash';

interface FormTest {
  name: string;
}

export function TestForm() {
  const board = useAppSelector((state) => state.board.board);

  const formMethods = useReduxForm<FormTest>({
    defaultValues: { name: board!.name },
    rootSelector: state => state.board.board,
    changeAction: updateBoardProp
  });

  let onSubmit: SubmitHandler<FormTest> = (values) => {
    console.log(values);
  };

  return (
    <div>
      <FormProvider {...(formMethods as any)}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <label>Board name</label>
          <Input name={'name'} selector={(state) => state.board.board!.name }/>
          <button>submit</button>
        </form>
      </FormProvider>
    </div>
  );
}

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  name: TName;
  selector: (state: RootState) => any,
}

function Input<
  TFieldValue extends FieldValues,
  TName extends FieldPath<TFieldValue>,
>({ name, selector }: InputProps<TFieldValue, TName>) {
  const defaultValue = useAppSelector((state) => _.get(state, name));
  const dispatch = useAppDispatch();

  const {
    field: { onBlur, ref, onChange, value },
  } = useController({
    name,
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const name = event.target.value;
    dispatch(updateBoard({ name }));
    onChange(name);
  };

  return (
    <input
      onChange={handleChange}
      name={name}
      ref={ref}
      value={value}
      onBlur={onBlur}
    />
  );
}

export interface UseReduxFromProps<TFieldValues extends FieldValues = FieldValues, TContext = any> extends UseFormProps<TFieldValues, TContext>{
  rootSelector?: (state: RootState) => any;
  changeAction: any; //TODO add types
}

export function useReduxForm<TFieldValues extends FieldValues, TContext = any>( props: UseReduxFromProps) {
  const { rootSelector, changeAction, ...formProps } = props;
  const { register, ...rest } = useForm<TFieldValues, TContext>(formProps as any)
  const dispatch = useAppDispatch();

  const reduxRegister: UseFormRegister<TFieldValues> = useCallback( (props) => {
    const { onChange, ...rest } = register(props);

    const reduxChange: ChangeHandler =  async ( event ) => {
      const payload: FormUpdateActionPayload = {
        property: rest.name,
        value: event.target.value
      }
      console.log('Dispatch ', payload)
      dispatch(changeAction(payload))
    }

    return {
      onChange: reduxChange,
      ...rest
    }

  }, [register, rootSelector, changeAction])


  return {
    register: reduxRegister,
    ...rest
  }
}
