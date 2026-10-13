import Button from "@/components/atoms/button/Button";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import Checkbox from "@/components/atoms/checkbox/Checkbox";
import HomeLogo from "@/components/atoms/Logo/home-logo";
import Radio from "@/components/atoms/radio/Radio";
import SignButton from "@/components/atoms/Sign-button/signButton";
import Switch from "@/components/atoms/switch/Switch";
import { ArrowLeft01Icon, ArrowRight01Icon, User } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export default function ComponentsPreview() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="mb-8 text-3xl font-bold">
                Components Preview
            </h1>

            <section className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Buttons
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <Button hasIcon={false} variant="primary">Primary</Button>
                    <Button
                        endIcon={
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={24}
                                strokeWidth={1.5}
                            />
                        }
                        variant="secondary"
                        size="md"
                    >Secondary
                    </Button>
                    <Button startIcon={
                        <HugeiconsIcon
                            icon={ArrowLeft01Icon}
                            size={24}
                            strokeWidth={1.5}
                        />
                    } variant="outline">Outline</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="tertiary">Tertiary</Button>

                </div>
            </section>

            <section className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Only Icon Buttons
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <ButtonOnlyIcon
                        size="sm"
                        hasIcon={false}
                    >
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </ButtonOnlyIcon>

                    <ButtonOnlyIcon
                        variant="secondary"
                        size="md"
                        hasIcon={false}
                    >
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </ButtonOnlyIcon>

                    <ButtonOnlyIcon
                        variant="danger"
                        size="lg"
                        hasIcon={false}
                    >
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </ButtonOnlyIcon>

                    <ButtonOnlyIcon
                        variant="outline"
                        size="sm"
                        hasIcon={false}
                    >
                        <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={24}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </ButtonOnlyIcon>
                </div>
            </section>

            <section className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Sign Buttons
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <SignButton text="Google" />

                </div>
            </section>

            <section className="mb-8 rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Home Logo
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                    <HomeLogo />


                </div>



            </section>
            <h1 className="text-xl font-semibold text-black dark:text-white">
                Switch Preview
            </h1>

            {/* Uncontrolled */}
            <section className="flex items-center gap-4">
                <span className="text-sm text-black dark:text-white">
                    Switch
                </span>
                <Switch defaultChecked={false} />
                <span className="text-sm text-black dark:text-white">
                    Checkbox
                </span>
            <Checkbox
  label="متن"
 
/>
                <span className="text-sm text-black dark:text-white">
                    Radio
                </span>
   <Radio
  name="payment"
  options={[
    { value: "female", label: "زن" },
    { value: "male", label: "مرد" },
  ]}
/>
            </section>
        </main>
    );
}