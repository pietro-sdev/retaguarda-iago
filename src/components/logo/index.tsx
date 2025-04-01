import Image from "next/image";


type Props = {
    size:number;    
}

export const Logo = ({size}: Props ) => {
    return(

            <Image
                src={'/logo.png'}
                alt=""
                width={size}
                height={size}
                quality={100}
            />

    )
}