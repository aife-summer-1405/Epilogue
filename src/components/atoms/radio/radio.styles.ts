
export const radioStyles = {
  group: "flex items-center gap-6",

  root: `
    relative flex size-[20px] shrink-0 items-center justify-center
    rounded-full border-[1px] transition-colors duration-200
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-primary-500
    focus-visible:ring-offset-3
    disabled:cursor-not-allowed disabled:opacity-50

    border-[#DFE1E7] bg-[#E9ECF6]
    data-[checked]:border-primary-700
    data-[checked]:bg-white 

    dark:border-[#3B3D46]
    dark:bg-primary-200
    dark:data-[checked]:border-primary-600
    dark:data-[checked]:bg-[#292D3D]

        cursor-pointer

  `,

  indicator: `
    size-[34px] rounded-full bg-primary-700
    dark:bg-primary-400
  `,
};