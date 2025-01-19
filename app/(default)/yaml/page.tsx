export const metadata = {
    title: 'AlignAIR CLI yaml generator',
    description: 'AlignAIR yaml generator',
  }
  import Link from 'next/link'
  import Yaml from '@/components/helpers/generateYaml'

  export default function YamlPage() {
    return (
      <>
        <Yaml />
      </>
    )
  }
  