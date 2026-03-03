import type { ReactNode } from "react";
import {
  type Control,
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";

type FormBaseProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  label: ReactNode;
  description?: ReactNode;
  control: Control<TFieldValues>;
  horizontal?: boolean;
  controlFirst?: boolean;
  children: (
    field: ControllerRenderProps<TFieldValues, TName> & {
      "aria-invalid": boolean;
      id: string;
    },
  ) => ReactNode;
};

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  children,
  control,
  label,
  name,
  description,
  horizontal,
}: FormBaseProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const controlElement = children({
          ...field,
          id: field.name,
          "aria-invalid": fieldState.invalid,
        });

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
          >
            <FieldContent>
              <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
              {controlElement}
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
