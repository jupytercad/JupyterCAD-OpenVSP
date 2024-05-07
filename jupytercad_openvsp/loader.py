import shutil
import tempfile
from typing import Optional
from os.path import join

try:
    import openvsp as vsp
except ImportError:
    vsp = None


def vsp3_to_stl(vsp_str: Optional[str]) -> str:
    if not vsp:
        return ""

    stl_str = ""
    if not vsp_str:
        return stl_str
    vsp.ClearVSPModel()
    tmp_path = tempfile.mkdtemp()
    vsp_temp_file = join(tmp_path, "temp.vsp3")
    stl_temp_file = join(tmp_path, "temp.stl")
    with open(vsp_temp_file, "w") as f:
        f.write(vsp_str)

    vsp.ReadVSPFile(vsp_temp_file)
    vsp.ExportFile(stl_temp_file, vsp.SET_ALL, vsp.EXPORT_STL)
    with open(stl_temp_file, "r") as stl_f:
        stl_str = stl_f.read()
    vsp.ClearVSPModel()
    shutil.rmtree(tmp_path)
    return stl_str
