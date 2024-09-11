import { PerspectiveCamera, View, OrbitControls } from "@react-three/drei";
import { Lights } from "src/components/Lights.jsx";
import { memo, Suspense } from "react";
import { Iphone } from "src/components/Iphone.jsx";
import { Loader } from "src/components/Loader.jsx";

export const ModelView = memo(({ index, groupRef, gsapType, controlRef, setRotationState, item, size }) => {

  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]}/>
      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={[0, 0, 0]}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />


      <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
        <Suspense fallback={<Loader />}>
          <Iphone
            item={item}
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            size={size}
          />
        </Suspense>
      </group>

    </View>
  );
})

