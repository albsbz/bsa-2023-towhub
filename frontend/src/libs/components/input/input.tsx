import {
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { IconName } from '~/libs/enums/icon-name.enum';
import { getValidClassNames } from '~/libs/helpers/helpers.js';
import {
  useCallback,
  useFormController,
  useState,
} from '~/libs/hooks/hooks.js';

import { Icon } from '../components.js';
import styles from './styles.module.scss';

type Properties<T extends FieldValues> = {
  control: Control<T, null>;
  errors: FieldErrors<T>;
  label?: string;
  name: FieldPath<T>;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  isDisabled?: boolean;
};

const Input = <T extends FieldValues>({
  control,
  errors,
  label = '',
  name,
  placeholder = '',
  type = 'text',
  isDisabled,
}: Properties<T>): JSX.Element => {
  const { field } = useFormController({ name, control });
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name]?.message;
  const hasError = Boolean(error);
  const hasValue = Boolean(field.value);
  const hasLabel = Boolean(label);
  const inputStyles = [
    styles.input,
    hasValue && styles.filled,
    isDisabled && styles.disabled,
    hasError && styles.error,
  ];

  const toggleShowPassword = useCallback(
    (event: React.MouseEvent<HTMLElement>): void => {
      event.preventDefault();
      setShowPassword(!showPassword);
    },
    [showPassword],
  );

  return (
    <label className={styles.inputComponentWrapper}>
      {hasLabel && <span className={styles.label}>{label}</span>}
      <span className={styles.inputWrapper}>
        <input
          {...field}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className={getValidClassNames(...inputStyles)}
          disabled={isDisabled}
        />
        {type === 'password' && (
          <button
            className={styles.passwordEye}
            onClick={toggleShowPassword}
            tabIndex={-1}
          >
            <Icon iconName={IconName.EYE} size="sm" />
          </button>
        )}
      </span>

      <span
        className={getValidClassNames(
          styles.errorMessage,
          hasError && styles.visible,
        )}
      >
        {error as string}
      </span>
    </label>
  );
};

export { Input };
