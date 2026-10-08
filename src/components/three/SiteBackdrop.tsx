import { useBackdropMode } from '../../hooks/useDeviceCapabilities';
import FlowFibers from './FlowFibers';

/**
 * Fixed, click-through layer behind the whole page: glowing fibres that run down the page and
 * switch sides section by section. See FlowFibers for how it is drawn.
 */
export function SiteBackdrop() {
  const mode = useBackdropMode();
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <FlowFibers mode={mode} />
    </div>
  );
}
