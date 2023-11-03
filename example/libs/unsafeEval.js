/*!
 * @pixi/unsafe-eval - v5.0.4
 * Compiled Fri, 07 Jun 2019 17:17:49 UTC
 *
 * @pixi/unsafe-eval is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
// cv = CachedValue
// v = value
// ud = uniformData
// uv = uniformValue
// l = location

/* eslint-disable max-len */
var GLSL_TO_SINGLE_SETTERS = {
    float: function float(gl, location, cv, v)
    {
        if (cv !== v)
        {
            cv.v = v;
            gl.uniform1f(location, v);
        }
    },
    vec2: function vec2(gl, location, cv, v)
    {
        if (cv[0] !== v[0] || cv[1] !== v[1])
        {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2f(location, v[0], v[1]);
        }
    },
    vec3: function vec3(gl, location, cv, v)
    {
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
        {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];

            gl.uniform3f(location, v[0], v[1], v[2]);
        }
    },
    int: function int(gl, location, cv, value) { gl.uniform1i(location, value); },
    ivec2: function ivec2(gl, location, cv, value) { gl.uniform2i(location, value[0], value[1]); },
    ivec3: function ivec3(gl, location, cv, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    ivec4: function ivec4(gl, location, cv, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    bool: function bool(gl, location, cv, value) { gl.uniform1i(location, value); },
    bvec2: function bvec2(gl, location, cv, value) { gl.uniform2i(location, value[0], value[1]); },
    bvec3: function bvec3(gl, location, cv, value) { gl.uniform3i(location, value[0], value[1], value[2]); },
    bvec4: function bvec4(gl, location, cv, value) { gl.uniform4i(location, value[0], value[1], value[2], value[3]); },

    mat2: function mat2(gl, location, cv, value) { gl.uniformMatrix2fv(location, false, value); },
    mat3: function mat3(gl, location, cv, value) { gl.uniformMatrix3fv(location, false, value); },
    mat4: function mat4(gl, location, cv, value) { gl.uniformMatrix4fv(location, false, value); },

    sampler2D: function sampler2D(gl, location, cv, value) { gl.uniform1i(location, value); },
    samplerCube: function samplerCube(gl, location, cv, value) { gl.uniform1i(location, value); },
    sampler2DArray: function sampler2DArray(gl, location, cv, value) { gl.uniform1i(location, value); },
};

var GLSL_TO_ARRAY_SETTERS = {
    float: function float(gl, location, cv, value) { gl.uniform1fv(location, value); },
    vec2: function vec2(gl, location, cv, value) { gl.uniform2fv(location, value); },
    vec3: function vec3(gl, location, cv, value) { gl.uniform3fv(location, value); },
    vec4: function vec4(gl, location, cv, value) { gl.uniform4fv(location, value); },
    int: function int(gl, location, cv, value) { gl.uniform1iv(location, value); },
    ivec2: function ivec2(gl, location, cv, value) { gl.uniform2iv(location, value); },
    ivec3: function ivec3(gl, location, cv, value) { gl.uniform3iv(location, value); },
    ivec4: function ivec4(gl, location, cv, value) { gl.uniform4iv(location, value); },
    bool: function bool(gl, location, cv, value) { gl.uniform1iv(location, value); },
    bvec2: function bvec2(gl, location, cv, value) { gl.uniform2iv(location, value); },
    bvec3: function bvec3(gl, location, cv, value) { gl.uniform3iv(location, value); },
    bvec4: function bvec4(gl, location, cv, value) { gl.uniform4iv(location, value); },
    sampler2D: function sampler2D(gl, location, cv, value) { gl.uniform1iv(location, value); },
    samplerCube: function samplerCube(gl, location, cv, value) { gl.uniform1iv(location, value); },
    sampler2DArray: function sampler2DArray(gl, location, cv, value) { gl.uniform1iv(location, value); },
};
/* eslint-disable max-len */

function syncUniforms(group, uniformData, ud, uv, renderer)
{
    var textureCount = 0;
    var v = null;
    var cv = null;
    var gl = renderer.gl;

    for (var i in group.uniforms)
    {
        var data = uniformData[i];
        var uvi = uv[i];
        var udi = ud[i];
        var gu = group.uniforms[i];

        if (!data)
        {
            if (gu.group)
            {
                renderer.shader.syncUniformGroup(uvi);
            }

            continue;
        }

        if (data.type === 'float' && data.size === 1)
        {
            if (uvi !== udi.value)
            {
                udi.value = uvi;
                gl.uniform1f(udi.location, uvi);
            }
        }
        /* eslint-disable max-len */
        else if ((data.type === 'sampler2D' || data.type === 'samplerCube' || data.type === 'sampler2DArray') && data.size === 1 && !data.isArray)
        /* eslint-disable max-len */
        {
            renderer.texture.bind(uvi, textureCount);

            if (udi.value !== textureCount)
            {
                udi.value = textureCount;
                gl.uniform1i(udi.location, textureCount);
            }

            textureCount++;
        }
        else if (data.type === 'mat3' && data.size === 1)
        {
            if (gu.a !== undefined)
            {
                gl.uniformMatrix3fv(udi.location, false, uvi.toArray(true));
            }
            else
            {
                gl.uniformMatrix3fv(udi.location, false, uvi);
            }
        }
        else if (data.type === 'vec2' && data.size === 1)
        {
            if (gu.x !== undefined)
            {
                cv = udi.value;
                v = uvi;

                if (cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(udi.location, v.x, v.y);
                }
            }
            else
            {
                cv = udi.value;
                v = uvi;

                if (cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(udi.location, v[0], v[1]);
                }
            }
        }
        else if (data.type === 'vec4' && data.size === 1)
        {
            if (gu.width !== undefined)
            {
                cv = udi.value;
                v = uvi;

                if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(udi.location, v.x, v.y, v.width, v.height);
                }
            }
            else
            {
                cv = udi.value;
                v = uvi;

                if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(udi.location, v[0], v[1], v[2], v[3]);
                }
            }
        }
        else
        {
            var funcArray = (data.size === 1) ? GLSL_TO_SINGLE_SETTERS : GLSL_TO_ARRAY_SETTERS;

            funcArray[data.type].call(null, gl, udi.location, udi.value, uvi);
        }
    }
}

function unsafeEval(PIXI)
{
    if (!PIXI || !PIXI.ShaderSystem)
    {
        throw new Error('Unable to patch ShaderSystem, class not found.');
    }

    var ShaderSystem = PIXI.ShaderSystem;
    var proceed = false;

    // Do a quick check to see if the patch is needed
    // want to make sure we only apply if necessary!
    try
    {
        ShaderSystem.prototype.systemCheck.call(null);
        proceed = false;
    }
    catch (err)
    {
        proceed = true;
    }

    // Only apply if needed
    if (proceed)
    {
        Object.assign(ShaderSystem.prototype,
            {
                systemCheck: function systemCheck()
                {
                // do nothing, don't throw error
                },
                syncUniforms: function syncUniforms$1(group, glProgram)
                {
                    var ref = this;
                    var shader = ref.shader;
                    var renderer = ref.renderer;

                    /* eslint-disable max-len */
                    syncUniforms(
                        group,
                        shader.program.uniformData,
                        glProgram.uniformData,
                        group.uniforms,
                        renderer
                    );
                /* eslint-disable max-len */
                },
            }
        );
    }
}

module.exports = unsafeEval
