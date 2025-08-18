import { useRequest } from 'ahooks';
import { Button, ButtonProps } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';

interface LoadingButtonProps extends ButtonProps {
  requestApi: (...args: any[]) => Promise<any>;
  onSuccess?: (...args: any[]) => void;
}

const LoadingButton = forwardRef<
  React.RefObject<HTMLButtonElement | HTMLAnchorElement>,
  LoadingButtonProps
>(({ requestApi, onSuccess, ...props }, ref) => {
  const antdButtonRef = React.useRef<HTMLButtonElement | HTMLAnchorElement>(
    null,
  );

  const { loading, run } = useRequest(requestApi, {
    manual: true,
    onSuccess,
  });

  useImperativeHandle(ref, () => antdButtonRef);
  return (
    <Button {...props} loading={loading} onClick={run} ref={antdButtonRef}>
      {props.children}
    </Button>
  );
});

export default LoadingButton;
