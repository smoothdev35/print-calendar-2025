import { type ComponentType } from 'react'
import { Controller, type UseControllerProps, type FieldValues } from 'react-hook-form'

export const withController = <T extends object>(Component: ComponentType<T>) => {
  type Props<TFieldValues extends FieldValues> = UseControllerProps<TFieldValues> & T & { label: string };

  return <TFieldValues extends FieldValues>(props: Props<TFieldValues>) => {
    const { control, name, rules, shouldUnregister, defaultValue, label, ...componentProps } = props;

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        shouldUnregister={shouldUnregister}
        defaultValue={defaultValue}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <Component {...(componentProps as T)} {...field} />
            {fieldState.error && <p className="text-red-500 text-xs">{fieldState.error.message}</p>}
          </div>
        )}
      />
    );
  };
};
