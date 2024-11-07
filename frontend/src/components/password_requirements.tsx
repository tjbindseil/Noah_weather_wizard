import { Tooltip } from 'react-tooltip';

export function PasswordRequirements() {
  const contents = `Password Requirement:<br/>
<ul style={text-align: left}>
<li>At least 8 characters</li>
<li>At least 1 number</li>
<li>At least 1 special character</li>
<li>At least 1 uppercase letter</li>
<li>At least 1 lowercase letter</li>
</ul>`;
  const tooltipId = 'password-requirements-tooltip';

  return (
    <>
      <a data-tooltip-id={tooltipId} data-tooltip-html={contents}>
        (i)
      </a>
      <Tooltip id={tooltipId} />
    </>
  );
}
