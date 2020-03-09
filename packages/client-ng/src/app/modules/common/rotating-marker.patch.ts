/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { DomUtil, Marker } from 'leaflet';

(() => {
    // save these original methods before they are overwritten
    const protoInitIcon = (Marker.prototype as any)._initIcon;
    const protoSetPos = (Marker.prototype as any)._setPos;

    const oldIE = (DomUtil.TRANSFORM === 'msTransform');

    Marker.addInitHook(function() {
        const iconOptions = this.options.icon && this.options.icon.options;
        let iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', (e) => { e.target._applyRotation(); });
    });

    Marker.include({

        _applyRotation() {
            if (this.options.rotationAngle) {
                this._icon.style[DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        _initIcon() {
            protoInitIcon.call(this);
        },

        _key: undefined,

        _setPos(pos) {
            protoSetPos.call(this, pos);
            this._applyRotation();
        },

        getKey() {
            return this._key;
        },
        setKey(key) {
            this._key = key;
        },
        setRotationAngle(angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin(origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        },
    });
})();
