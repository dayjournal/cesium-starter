define(["./defaultValue-81eec7ed","./Matrix2-7fbd2afb","./ArcType-fc72c06c","./GeometryOffsetAttribute-8c5e10db","./Transforms-969e35b7","./RuntimeError-8952249c","./ComponentDatatype-be80d12c","./EllipsoidTangentPlane-db930c09","./GeometryAttribute-6e58c1bc","./GeometryAttributes-32b29525","./GeometryInstance-c4f24c7c","./GeometryPipeline-53aca64d","./IndexDatatype-a852edb7","./PolygonGeometryLibrary-2768b436","./PolygonPipeline-fd65423b","./_commonjsHelpers-3aae1032-26891ab7","./combine-3c023bda","./WebGLConstants-508b9636","./AxisAlignedBoundingBox-842a104c","./IntersectionTests-325bf999","./Plane-85eed013","./AttributeCompression-d533c8a1","./EncodedCartesian3-17187cc5","./arrayRemoveDuplicates-ea800094","./EllipsoidRhumbLine-c2325569"],(function(e,t,i,r,o,n,a,s,l,y,u,p,c,d,g,f,m,h,b,P,E,A,_,G,L){"use strict";const H=[],T=[];function v(e,t,r,o,n){const p=s.EllipsoidTangentPlane.fromPoints(t,e).projectPointsOntoPlane(t,H);let f,m;g.PolygonPipeline.computeWindingOrder2D(p)===g.WindingOrder.CLOCKWISE&&(p.reverse(),t=t.slice().reverse());let h=t.length,b=0;if(o)for(f=new Float64Array(2*h*3),m=0;m<h;m++){const e=t[m],i=t[(m+1)%h];f[b++]=e.x,f[b++]=e.y,f[b++]=e.z,f[b++]=i.x,f[b++]=i.y,f[b++]=i.z}else{let o=0;if(n===i.ArcType.GEODESIC)for(m=0;m<h;m++)o+=d.PolygonGeometryLibrary.subdivideLineCount(t[m],t[(m+1)%h],r);else if(n===i.ArcType.RHUMB)for(m=0;m<h;m++)o+=d.PolygonGeometryLibrary.subdivideRhumbLineCount(e,t[m],t[(m+1)%h],r);for(f=new Float64Array(3*o),m=0;m<h;m++){let o;n===i.ArcType.GEODESIC?o=d.PolygonGeometryLibrary.subdivideLine(t[m],t[(m+1)%h],r,T):n===i.ArcType.RHUMB&&(o=d.PolygonGeometryLibrary.subdivideRhumbLine(e,t[m],t[(m+1)%h],r,T));const a=o.length;for(let e=0;e<a;++e)f[b++]=o[e]}}h=f.length/3;const P=2*h,E=c.IndexDatatype.createTypedArray(h,P);for(b=0,m=0;m<h-1;m++)E[b++]=m,E[b++]=m+1;return E[b++]=h-1,E[b++]=0,new u.GeometryInstance({geometry:new l.Geometry({attributes:new y.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f})}),indices:E,primitiveType:l.PrimitiveType.LINES})})}function C(e,t,r,o,n){const p=s.EllipsoidTangentPlane.fromPoints(t,e).projectPointsOntoPlane(t,H);let f,m;g.PolygonPipeline.computeWindingOrder2D(p)===g.WindingOrder.CLOCKWISE&&(p.reverse(),t=t.slice().reverse());let h=t.length;const b=new Array(h);let P=0;if(o)for(f=new Float64Array(2*h*3*2),m=0;m<h;++m){b[m]=P/3;const e=t[m],i=t[(m+1)%h];f[P++]=e.x,f[P++]=e.y,f[P++]=e.z,f[P++]=i.x,f[P++]=i.y,f[P++]=i.z}else{let o=0;if(n===i.ArcType.GEODESIC)for(m=0;m<h;m++)o+=d.PolygonGeometryLibrary.subdivideLineCount(t[m],t[(m+1)%h],r);else if(n===i.ArcType.RHUMB)for(m=0;m<h;m++)o+=d.PolygonGeometryLibrary.subdivideRhumbLineCount(e,t[m],t[(m+1)%h],r);for(f=new Float64Array(3*o*2),m=0;m<h;++m){let o;b[m]=P/3,n===i.ArcType.GEODESIC?o=d.PolygonGeometryLibrary.subdivideLine(t[m],t[(m+1)%h],r,T):n===i.ArcType.RHUMB&&(o=d.PolygonGeometryLibrary.subdivideRhumbLine(e,t[m],t[(m+1)%h],r,T));const a=o.length;for(let e=0;e<a;++e)f[P++]=o[e]}}h=f.length/6;const E=b.length,A=2*(2*h+E),_=c.IndexDatatype.createTypedArray(h+E,A);for(P=0,m=0;m<h;++m)_[P++]=m,_[P++]=(m+1)%h,_[P++]=m+h,_[P++]=(m+1)%h+h;for(m=0;m<E;m++){const e=b[m];_[P++]=e,_[P++]=e+h}return new u.GeometryInstance({geometry:new l.Geometry({attributes:new y.GeometryAttributes({position:new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:f})}),indices:_,primitiveType:l.PrimitiveType.LINES})})}function O(r){const o=r.polygonHierarchy,n=e.defaultValue(r.ellipsoid,t.Ellipsoid.WGS84),s=e.defaultValue(r.granularity,a.CesiumMath.RADIANS_PER_DEGREE),l=e.defaultValue(r.perPositionHeight,!1),y=l&&e.defined(r.extrudedHeight),u=e.defaultValue(r.arcType,i.ArcType.GEODESIC);let p=e.defaultValue(r.height,0),c=e.defaultValue(r.extrudedHeight,p);if(!y){const e=Math.max(p,c);c=Math.min(p,c),p=e}this._ellipsoid=t.Ellipsoid.clone(n),this._granularity=s,this._height=p,this._extrudedHeight=c,this._arcType=u,this._polygonHierarchy=o,this._perPositionHeight=l,this._perPositionHeightExtrude=y,this._offsetAttribute=r.offsetAttribute,this._workerName="createPolygonOutlineGeometry",this.packedLength=d.PolygonGeometryLibrary.computeHierarchyPackedLength(o,t.Cartesian3)+t.Ellipsoid.packedLength+8}O.pack=function(i,r,o){return o=e.defaultValue(o,0),o=d.PolygonGeometryLibrary.packPolygonHierarchy(i._polygonHierarchy,r,o,t.Cartesian3),t.Ellipsoid.pack(i._ellipsoid,r,o),o+=t.Ellipsoid.packedLength,r[o++]=i._height,r[o++]=i._extrudedHeight,r[o++]=i._granularity,r[o++]=i._perPositionHeightExtrude?1:0,r[o++]=i._perPositionHeight?1:0,r[o++]=i._arcType,r[o++]=e.defaultValue(i._offsetAttribute,-1),r[o]=i.packedLength,r};const x=t.Ellipsoid.clone(t.Ellipsoid.UNIT_SPHERE),D={polygonHierarchy:{}};return O.unpack=function(i,r,o){r=e.defaultValue(r,0);const n=d.PolygonGeometryLibrary.unpackPolygonHierarchy(i,r,t.Cartesian3);r=n.startingIndex,delete n.startingIndex;const a=t.Ellipsoid.unpack(i,r,x);r+=t.Ellipsoid.packedLength;const s=i[r++],l=i[r++],y=i[r++],u=1===i[r++],p=1===i[r++],c=i[r++],g=i[r++],f=i[r];return e.defined(o)||(o=new O(D)),o._polygonHierarchy=n,o._ellipsoid=t.Ellipsoid.clone(a,o._ellipsoid),o._height=s,o._extrudedHeight=l,o._granularity=y,o._perPositionHeight=p,o._perPositionHeightExtrude=u,o._arcType=c,o._offsetAttribute=-1===g?void 0:g,o.packedLength=f,o},O.fromPositions=function(t){return new O({polygonHierarchy:{positions:(t=e.defaultValue(t,e.defaultValue.EMPTY_OBJECT)).positions},height:t.height,extrudedHeight:t.extrudedHeight,ellipsoid:t.ellipsoid,granularity:t.granularity,perPositionHeight:t.perPositionHeight,arcType:t.arcType,offsetAttribute:t.offsetAttribute})},O.createGeometry=function(t){const i=t._ellipsoid,n=t._granularity,s=t._polygonHierarchy,y=t._perPositionHeight,u=t._arcType,c=d.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(s,!y,i);if(0===c.length)return;let f;const m=[],h=a.CesiumMath.chordLength(n,i.maximumRadius),b=t._height,P=t._extrudedHeight;let E,A;if(t._perPositionHeightExtrude||!a.CesiumMath.equalsEpsilon(b,P,0,a.CesiumMath.EPSILON2))for(A=0;A<c.length;A++){if(f=C(i,c[A],h,y,u),f.geometry=d.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(f.geometry,b,P,i,y),e.defined(t._offsetAttribute)){const e=f.geometry.attributes.position.values.length/3;let i=new Uint8Array(e);t._offsetAttribute===r.GeometryOffsetAttribute.TOP?i=r.arrayFill(i,1,0,e/2):(E=t._offsetAttribute===r.GeometryOffsetAttribute.NONE?0:1,i=r.arrayFill(i,E)),f.geometry.attributes.applyOffset=new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i})}m.push(f)}else for(A=0;A<c.length;A++){if(f=v(i,c[A],h,y,u),f.geometry.attributes.position.values=g.PolygonPipeline.scaleToGeodeticHeight(f.geometry.attributes.position.values,b,i,!y),e.defined(t._offsetAttribute)){const e=f.geometry.attributes.position.values.length,i=new Uint8Array(e/3);E=t._offsetAttribute===r.GeometryOffsetAttribute.NONE?0:1,r.arrayFill(i,E),f.geometry.attributes.applyOffset=new l.GeometryAttribute({componentDatatype:a.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:i})}m.push(f)}const _=p.GeometryPipeline.combineInstances(m)[0],G=o.BoundingSphere.fromVertices(_.attributes.position.values);return new l.Geometry({attributes:_.attributes,indices:_.indices,primitiveType:_.primitiveType,boundingSphere:G,offsetAttribute:t._offsetAttribute})},function(i,r){return e.defined(r)&&(i=O.unpack(i,r)),i._ellipsoid=t.Ellipsoid.clone(i._ellipsoid),O.createGeometry(i)}}));