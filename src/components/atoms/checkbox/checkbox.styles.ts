export const checkboxStyles = {
  root: `
    flex size-[20px] shrink-0 items-center justify-center
    rounded-[6px] border-[1px]
    border-[#DFE1E7] bg-[#E9ECF6]
    transition-colors duration-200

    data-checked:border-primary-700
    data-checked:bg-[#E9ECF6]

    dark:border-[#3B3D46]
    dark:bg-[#292D3D]
    dark:data-checked:border-primary-600
    dark:data-checked:bg-[#292D3D]

    [&_svg]:text-primary-600
    [&_svg]:opacity-100

    cursor-pointer
  `,
  icon: "size-9",
};
